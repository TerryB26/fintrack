import { Injectable, UnauthorizedException, NotFoundException } from '@nestjs/common';
import { DbService } from '../db.service';

@Injectable()
export class AccountsService {
  constructor(private db: DbService) {}

  async getAccounts(userId: number) {
    const result = await this.db.query(
      `SELECT id, uuid, account_name, currency, balance, account_type, is_locked, created_at, updated_at 
       FROM accounts 
       WHERE user_id = $1 
       ORDER BY account_type, currency`,
      [userId]
    );

    return {
      success: true,
      data: result.rows.map(row => ({
        id: row.id,
        uuid: row.uuid,
        accountName: row.account_name,
        currency: row.currency,
        balance: parseFloat(row.balance),
        accountType: row.account_type,
        isLocked: row.is_locked,
        createdAt: row.created_at,
        updatedAt: row.updated_at,
      })),
      count: result.rows.length,
    };
  }

  async getAccountBalance(userId: number, accountId: number) {
    const result = await this.db.query(
      `SELECT id, uuid, account_name, currency, balance, account_type, is_locked 
       FROM accounts 
       WHERE id = $1 AND user_id = $2`,
      [accountId, userId]
    );

    if (result.rows.length === 0) {
      throw new NotFoundException('Account not found');
    }

    const account = result.rows[0];
    return {
      success: true,
      data: {
        id: account.id,
        uuid: account.uuid,
        accountName: account.account_name,
        currency: account.currency,
        balance: parseFloat(account.balance),
        accountType: account.account_type,
        isLocked: account.is_locked,
      }
    };
  }
}
