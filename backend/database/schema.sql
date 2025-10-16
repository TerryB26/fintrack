-- FinTrack Database Schema
-- Double-Entry Ledger System for Financial Integrity

-- Drop existing tables if they exist (for fresh setup)
DROP TABLE IF EXISTS ledger_entries CASCADE;
DROP TABLE IF EXISTS transactions CASCADE;
DROP TABLE IF EXISTS accounts CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users Table
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    uuid UUID DEFAULT uuid_generate_v4() UNIQUE NOT NULL,
    username VARCHAR(100) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_active BOOLEAN DEFAULT TRUE
);

-- Accounts Table (Multi-currency support)
CREATE TABLE accounts (
    id SERIAL PRIMARY KEY,
    uuid UUID DEFAULT uuid_generate_v4() UNIQUE NOT NULL,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    account_name VARCHAR(100) NOT NULL,
    currency VARCHAR(3) NOT NULL, -- USD, EUR, etc.
    balance DECIMAL(15, 2) DEFAULT 0.00,
    account_type VARCHAR(50) NOT NULL, -- 'main', 'savings', 'fixed'
    is_locked BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT unique_user_account UNIQUE(user_id, account_name, currency)
);

-- Transactions Table (High-level transaction records)
CREATE TABLE transactions (
    id SERIAL PRIMARY KEY,
    uuid UUID DEFAULT uuid_generate_v4() UNIQUE NOT NULL,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    transaction_type VARCHAR(20) NOT NULL, -- 'transfer', 'exchange', 'deposit', 'withdrawal'
    description TEXT,
    amount DECIMAL(15, 2) NOT NULL,
    currency VARCHAR(3) NOT NULL,
    from_account_id INTEGER REFERENCES accounts(id),
    to_account_id INTEGER REFERENCES accounts(id),
    exchange_rate DECIMAL(10, 6), -- For currency exchanges
    converted_amount DECIMAL(15, 2), -- Amount after exchange
    status VARCHAR(20) DEFAULT 'completed', -- 'pending', 'completed', 'failed', 'cancelled'
    transaction_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT check_amount_positive CHECK (amount > 0),
    CONSTRAINT check_accounts_different CHECK (from_account_id != to_account_id OR from_account_id IS NULL OR to_account_id IS NULL)
);

-- Ledger Entries Table (Double-entry bookkeeping)
-- Every transaction creates balanced entries (sum of amounts must equal zero)
CREATE TABLE ledger_entries (
    id SERIAL PRIMARY KEY,
    uuid UUID DEFAULT uuid_generate_v4() UNIQUE NOT NULL,
    transaction_id INTEGER NOT NULL REFERENCES transactions(id) ON DELETE CASCADE,
    account_id INTEGER NOT NULL REFERENCES accounts(id) ON DELETE CASCADE,
    amount DECIMAL(15, 2) NOT NULL, -- Positive for debit, negative for credit
    entry_type VARCHAR(10) NOT NULL, -- 'debit' or 'credit'
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT check_entry_type CHECK (entry_type IN ('debit', 'credit'))
);

-- Indexes for performance
CREATE INDEX idx_users_uuid ON users(uuid);
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_username ON users(username);
CREATE INDEX idx_accounts_uuid ON accounts(uuid);
CREATE INDEX idx_accounts_user_id ON accounts(user_id);
CREATE INDEX idx_accounts_currency ON accounts(currency);
CREATE INDEX idx_transactions_uuid ON transactions(uuid);
CREATE INDEX idx_transactions_user_id ON transactions(user_id);
CREATE INDEX idx_transactions_date ON transactions(transaction_date);
CREATE INDEX idx_transactions_type ON transactions(transaction_type);
CREATE INDEX idx_ledger_uuid ON ledger_entries(uuid);
CREATE INDEX idx_ledger_transaction_id ON ledger_entries(transaction_id);
CREATE INDEX idx_ledger_account_id ON ledger_entries(account_id);

-- Function to update account balances
CREATE OR REPLACE FUNCTION update_account_balance()
RETURNS TRIGGER AS $$
BEGIN
    -- Update the account balance based on ledger entry
    UPDATE accounts
    SET balance = balance + NEW.amount,
        updated_at = CURRENT_TIMESTAMP
    WHERE id = NEW.account_id;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to automatically update account balances
CREATE TRIGGER trigger_update_account_balance
AFTER INSERT ON ledger_entries
FOR EACH ROW
EXECUTE FUNCTION update_account_balance();

-- Function to validate double-entry consistency
CREATE OR REPLACE FUNCTION validate_ledger_balance()
RETURNS TRIGGER AS $$
DECLARE
    total_balance DECIMAL(15, 2);
BEGIN
    -- Check if the sum of all ledger entries for this transaction equals zero
    SELECT COALESCE(SUM(amount), 0) INTO total_balance
    FROM ledger_entries
    WHERE transaction_id = NEW.transaction_id;
    
    -- Allow small rounding errors (0.01)
    IF ABS(total_balance) > 0.01 THEN
        RAISE EXCEPTION 'Ledger entries must balance to zero. Current balance: %', total_balance;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to validate ledger balance after insert
CREATE TRIGGER trigger_validate_ledger_balance
AFTER INSERT ON ledger_entries
FOR EACH ROW
EXECUTE FUNCTION validate_ledger_balance();

-- Function to update timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers to update timestamps
CREATE TRIGGER update_users_timestamp
BEFORE UPDATE ON users
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_accounts_timestamp
BEFORE UPDATE ON accounts
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- View for transaction history with account details
CREATE OR REPLACE VIEW transaction_history AS
SELECT 
    t.id,
    t.uuid,
    t.user_id,
    t.transaction_type,
    t.description,
    t.amount,
    t.currency,
    t.exchange_rate,
    t.converted_amount,
    t.status,
    t.transaction_date,
    fa.account_name as from_account_name,
    ta.account_name as to_account_name,
    fa.currency as from_currency,
    ta.currency as to_currency
FROM transactions t
LEFT JOIN accounts fa ON t.from_account_id = fa.id
LEFT JOIN accounts ta ON t.to_account_id = ta.id
ORDER BY t.transaction_date DESC;

-- View for account balances with user info
CREATE OR REPLACE VIEW account_balances AS
SELECT 
    a.id as account_id,
    a.uuid as account_uuid,
    a.user_id,
    u.uuid as user_uuid,
    u.username,
    u.email,
    a.account_name,
    a.currency,
    a.balance,
    a.account_type,
    a.is_locked,
    a.created_at,
    a.updated_at
FROM accounts a
JOIN users u ON a.user_id = u.id;

COMMENT ON TABLE users IS 'User information and authentication';
COMMENT ON TABLE accounts IS 'User currency accounts with balances (each user has USD and EUR accounts)';
COMMENT ON TABLE transactions IS 'High-level transaction records for user-facing history';
COMMENT ON TABLE ledger_entries IS 'Double-entry bookkeeping records (sum of amounts must equal zero)';
COMMENT ON COLUMN ledger_entries.amount IS 'Positive for debit (increase asset/expense), negative for credit (increase liability/revenue)';
COMMENT ON COLUMN accounts.balance IS 'Automatically maintained by ledger entries - should NOT be updated directly';
COMMENT ON COLUMN users.uuid IS 'Unique identifier for external references';
COMMENT ON COLUMN accounts.uuid IS 'Unique identifier for external references';
COMMENT ON COLUMN transactions.uuid IS 'Unique identifier for external references';
COMMENT ON COLUMN ledger_entries.uuid IS 'Unique identifier for external references';
COMMENT ON TABLE transactions IS 'High-level transaction records for user-facing history';
COMMENT ON TABLE ledger_entries IS 'Double-entry bookkeeping records (sum of amounts must equal zero)';
COMMENT ON COLUMN ledger_entries.amount IS 'Positive for debit (increase asset/expense), negative for credit (increase liability/revenue)';
COMMENT ON COLUMN accounts.balance IS 'Automatically maintained by ledger entries - should NOT be updated directly';
