-- Drop all tables in reverse order of dependencies
DROP TABLE IF EXISTS ledger_entries CASCADE;
DROP TABLE IF EXISTS transactions CASCADE;
DROP TABLE IF EXISTS accounts CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- Drop all functions
DROP FUNCTION IF EXISTS update_account_balance() CASCADE;
DROP FUNCTION IF EXISTS validate_ledger_balance() CASCADE;
DROP FUNCTION IF EXISTS update_updated_at_column() CASCADE;

-- Drop all views
DROP VIEW IF EXISTS transaction_history CASCADE;
DROP VIEW IF EXISTS account_balances CASCADE;

-- Confirm
SELECT 'All tables, functions, and views dropped successfully' as status;
