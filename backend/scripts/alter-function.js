const { Client } = require('pg');
require('dotenv').config();

async function alterFunction() {
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
  });

  try {
    await client.connect();
    console.log('Connected to database');

    const alterQuery = `
      CREATE OR REPLACE FUNCTION validate_ledger_balance()
      RETURNS TRIGGER AS $$
      DECLARE
          total_balance DECIMAL(15, 2);
          entry_count INTEGER;
          trans_type VARCHAR(20);
      BEGIN
          -- Get transaction type
          SELECT transaction_type INTO trans_type FROM transactions WHERE id = NEW.transaction_id;
          
          -- Skip validation for exchange transactions
          IF trans_type = 'exchange' THEN
              RETURN NEW;
          END IF;
          
          -- Count entries for this transaction
          SELECT COUNT(*) INTO entry_count
          FROM ledger_entries
          WHERE transaction_id = NEW.transaction_id;
          
          -- Only validate when we have at least 2 entries (double-entry complete)
          IF entry_count >= 2 THEN
              -- Check if the sum of all ledger entries for this transaction equals zero
              SELECT COALESCE(SUM(amount), 0) INTO total_balance
              FROM ledger_entries
              WHERE transaction_id = NEW.transaction_id;
              
              -- Allow small rounding errors (0.01)
              IF ABS(total_balance) > 0.01 THEN
                  RAISE EXCEPTION 'Ledger entries must balance to zero. Current balance: %', total_balance;
              END IF;
          END IF;
          
          RETURN NEW;
      END;
      $$ LANGUAGE plpgsql;
    `;

    await client.query(alterQuery);
    console.log('Function altered successfully');
  } catch (error) {
    console.error('Error altering function:', error);
  } finally {
    await client.end();
  }
}

alterFunction();