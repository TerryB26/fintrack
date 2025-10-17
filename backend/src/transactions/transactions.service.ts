import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { DbService } from '../db.service';

@Injectable()
export class TransactionsService {
  constructor(private db: DbService) {}

  async getTransactions(userId: number, type?: string, page: number = 1, limit: number = 10) {
    let query = `
      SELECT t.id, t.uuid, t.transaction_type, t.description, t.amount, t.currency,
             t.exchange_rate, t.converted_amount, t.status, t.transaction_date,
             fa.account_name as from_account_name, fa.currency as from_currency,
             ta.account_name as to_account_name, ta.currency as to_currency
      FROM transactions t
      LEFT JOIN accounts fa ON t.from_account_id = fa.id
      LEFT JOIN accounts ta ON t.to_account_id = ta.id
      WHERE t.user_id = $1
    `;

    const params: any[] = [userId];

    if (type) {
      query += ' AND t.transaction_type = $2';
      params.push(type);
    }

    query += ' ORDER BY t.transaction_date DESC';

    const offset = (page - 1) * limit;
    query += ` LIMIT $${params.length + 1} OFFSET $${params.length + 2}`;
    params.push(limit, offset);

    const result = await this.db.query(query, params);

    const countQuery = type 
      ? 'SELECT COUNT(*) FROM transactions WHERE user_id = $1 AND transaction_type = $2'
      : 'SELECT COUNT(*) FROM transactions WHERE user_id = $1';
    const countParams = type ? [userId, type] : [userId];
    const countResult = await this.db.query(countQuery, countParams);

    return {
      success: true,
      data: result.rows.map(row => ({
        id: row.id,
        uuid: row.uuid,
        transactionType: row.transaction_type,
        description: row.description,
        amount: parseFloat(row.amount),
        currency: row.currency,
        exchangeRate: row.exchange_rate ? parseFloat(row.exchange_rate) : null,
        convertedAmount: row.converted_amount ? parseFloat(row.converted_amount) : null,
        status: row.status,
        transactionDate: row.transaction_date,
        fromAccount: row.from_account_name,
        fromCurrency: row.from_currency,
        toAccount: row.to_account_name,
        toCurrency: row.to_currency,
      })),
      count: parseInt(countResult.rows[0].count),
      page,
      limit,
    };
  }

  async transfer(userId: number, fromAccountId: number, toAccountId: number, amount: number, description?: string) {
    const client = await this.db.getClient();

    try {
      await client.query('BEGIN');

      const accountsResult = await client.query(
        'SELECT id, user_id, currency, balance, is_locked FROM accounts WHERE id IN ($1, $2)',
        [fromAccountId, toAccountId]
      );

      if (accountsResult.rows.length !== 2) {
        throw new BadRequestException('Invalid account IDs');
      }

      const fromAccount = accountsResult.rows.find(a => a.id === fromAccountId);
      const toAccount = accountsResult.rows.find(a => a.id === toAccountId);

      if (fromAccount.user_id !== userId && toAccount.user_id !== userId) {
        throw new BadRequestException('At least one account must belong to the user');
      }

      if (fromAccount.is_locked) {
        throw new BadRequestException('Source account is locked');
      }

      if (fromAccount.currency !== toAccount.currency) {
        throw new BadRequestException('Transfer must be in the same currency. Use exchange for different currencies.');
      }

      if (parseFloat(fromAccount.balance) < amount) {
        throw new BadRequestException('Insufficient funds');
      }

      const transactionResult = await client.query(
        `INSERT INTO transactions (user_id, transaction_type, description, amount, currency, from_account_id, to_account_id, status)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
         RETURNING id, uuid, transaction_date`,
        [userId, 'transfer', description || 'Transfer', amount, fromAccount.currency, fromAccountId, toAccountId, 'completed']
      );

      const transactionId = transactionResult.rows[0].id;

      await client.query(
        `INSERT INTO ledger_entries (transaction_id, account_id, amount, entry_type, description)
         VALUES ($1, $2, $3, $4, $5)`,
        [transactionId, fromAccountId, -amount, 'credit', 'Transfer out']
      );

      await client.query(
        `INSERT INTO ledger_entries (transaction_id, account_id, amount, entry_type, description)
         VALUES ($1, $2, $3, $4, $5)`,
        [transactionId, toAccountId, amount, 'debit', 'Transfer in']
      );

      await client.query('COMMIT');

      return {
        success: true,
        data: {
          id: transactionResult.rows[0].id,
          uuid: transactionResult.rows[0].uuid,
          transactionDate: transactionResult.rows[0].transaction_date,
          message: 'Transfer completed successfully',
        }
      };
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

  async exchange(userId: number, fromAccountId: number, toAccountId: number, amount: number, exchangeRate: number, targetAmount?: number, description?: string) {
    const client = await this.db.getClient();

    try {
      await client.query('BEGIN');

      const accountsResult = await client.query(
        'SELECT id, user_id, currency, balance, is_locked FROM accounts WHERE id IN ($1, $2)',
        [fromAccountId, toAccountId]
      );

      if (accountsResult.rows.length !== 2) {
        throw new BadRequestException('Invalid account IDs');
      }

      const fromAccount = accountsResult.rows.find(a => a.id === fromAccountId);
      const toAccount = accountsResult.rows.find(a => a.id === toAccountId);

      if (fromAccount.user_id !== userId || toAccount.user_id !== userId) {
        throw new BadRequestException('Both accounts must belong to the user');
      }

      if (fromAccount.is_locked || toAccount.is_locked) {
        throw new BadRequestException('One or both accounts are locked');
      }

      if (fromAccount.currency === toAccount.currency) {
        throw new BadRequestException('Exchange must be between different currencies. Use transfer for same currency.');
      }

      if (parseFloat(fromAccount.balance) < amount) {
        throw new BadRequestException('Insufficient funds');
      }

      // Use targetAmount provided by frontend if valid (pre-rounded), otherwise compute
      let convertedAmount = Number.isFinite(Number(targetAmount)) && Number(targetAmount) > 0
        ? Number(targetAmount)
        : amount * exchangeRate;

      // Round converted to 2 decimals for ledger integrity
      convertedAmount = Math.round(convertedAmount * 100) / 100;

      const transactionResult = await client.query(
        `INSERT INTO transactions (user_id, transaction_type, description, amount, currency, from_account_id, to_account_id, exchange_rate, converted_amount, status)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
         RETURNING id, uuid, transaction_date`,
        [userId, 'exchange', description || 'Currency Exchange', amount, fromAccount.currency, fromAccountId, toAccountId, exchangeRate, convertedAmount, 'completed']
      );

      const transactionId = transactionResult.rows[0].id;

      await client.query(
        `INSERT INTO ledger_entries (transaction_id, account_id, amount, entry_type, description)
         VALUES ($1, $2, $3, $4, $5)`,
        [transactionId, fromAccountId, -amount, 'credit', `Exchange ${fromAccount.currency} to ${toAccount.currency}`]
      );

      await client.query(
        `INSERT INTO ledger_entries (transaction_id, account_id, amount, entry_type, description)
         VALUES ($1, $2, $3, $4, $5)`,
        [transactionId, toAccountId, convertedAmount, 'debit', `Exchange ${fromAccount.currency} to ${toAccount.currency}`]
      );

      await client.query('COMMIT');

      return {
        success: true,
        data: {
          id: transactionResult.rows[0].id,
          uuid: transactionResult.rows[0].uuid,
          transactionDate: transactionResult.rows[0].transaction_date,
          convertedAmount,
          message: 'Exchange completed successfully',
        }
      };
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }
}

