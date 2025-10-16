-- FinTrack Seed Data Script

TRUNCATE TABLE ledger_entries CASCADE;
TRUNCATE TABLE transactions CASCADE;
TRUNCATE TABLE accounts CASCADE;
TRUNCATE TABLE users CASCADE;

ALTER SEQUENCE users_id_seq RESTART WITH 1;
ALTER SEQUENCE accounts_id_seq RESTART WITH 1;
ALTER SEQUENCE transactions_id_seq RESTART WITH 1;
ALTER SEQUENCE ledger_entries_id_seq RESTART WITH 1;

INSERT INTO users (username, email, password_hash, first_name, last_name, is_active) VALUES
('john_doe', 'john.doe@example.com', '$2b$10$rKJ5Z3Z5Z5Z5Z5Z5Z5Z5Z.abcdefghijklmnopqrstuvwxyz1234567', 'John', 'Doe', true),
('jane_smith', 'jane.smith@example.com', '$2b$10$rKJ5Z3Z5Z5Z5Z5Z5Z5Z5Z.abcdefghijklmnopqrstuvwxyz1234567', 'Jane', 'Smith', true),
('mike_johnson', 'mike.johnson@example.com', '$2b$10$rKJ5Z3Z5Z5Z5Z5Z5Z5Z5Z.abcdefghijklmnopqrstuvwxyz1234567', 'Mike', 'Johnson', true);

INSERT INTO accounts (user_id, account_name, currency, balance, account_type, is_locked) VALUES
(1, 'Main Account', 'USD', 1000.00, 'main', false),
(1, 'Main Account', 'EUR', 500.00, 'main', false),
(1, 'Savings Account', 'USD', 0.00, 'savings', true),
(1, 'Fixed Account', 'USD', 0.00, 'fixed', true);

INSERT INTO accounts (user_id, account_name, currency, balance, account_type, is_locked) VALUES
(2, 'Main Account', 'USD', 3500.00, 'main', false),
(2, 'Main Account', 'EUR', 2000.00, 'main', false),
(2, 'Savings Account', 'USD', 0.00, 'savings', true),
(2, 'Fixed Account', 'USD', 0.00, 'fixed', true);

INSERT INTO accounts (user_id, account_name, currency, balance, account_type, is_locked) VALUES
(3, 'Main Account', 'USD', 750.00, 'main', false),
(3, 'Main Account', 'EUR', 300.00, 'main', false),
(3, 'Savings Account', 'USD', 0.00, 'savings', true),
(3, 'Fixed Account', 'USD', 0.00, 'fixed', true);

ALTER TABLE ledger_entries DISABLE TRIGGER trigger_update_account_balance;
ALTER TABLE ledger_entries DISABLE TRIGGER trigger_validate_ledger_balance;

INSERT INTO transactions (user_id, transaction_type, description, amount, currency, to_account_id, status, transaction_date)
VALUES (1, 'deposit', 'Initial deposit', 1000.00, 'USD', 1, 'completed', '2025-10-01 10:00:00');

INSERT INTO ledger_entries (transaction_id, account_id, amount, entry_type, description)
VALUES (1, 1, 1000.00, 'debit', 'Initial deposit to Main Account USD');

INSERT INTO transactions (user_id, transaction_type, description, amount, currency, to_account_id, status, transaction_date)
VALUES (1, 'deposit', 'Initial EUR deposit', 500.00, 'EUR', 2, 'completed', '2025-10-01 10:05:00');

INSERT INTO ledger_entries (transaction_id, account_id, amount, entry_type, description)
VALUES (2, 2, 500.00, 'debit', 'Initial deposit to Main Account EUR');

INSERT INTO transactions (user_id, transaction_type, description, amount, currency, to_account_id, status, transaction_date)
VALUES (2, 'deposit', 'Salary deposit', 3500.00, 'USD', 5, 'completed', '2025-10-05 09:00:00');

INSERT INTO ledger_entries (transaction_id, account_id, amount, entry_type, description)
VALUES (3, 5, 3500.00, 'debit', 'Salary deposit');

INSERT INTO transactions (user_id, transaction_type, description, amount, currency, to_account_id, status, transaction_date)
VALUES (2, 'deposit', 'EUR deposit', 2000.00, 'EUR', 6, 'completed', '2025-10-05 09:10:00');

INSERT INTO ledger_entries (transaction_id, account_id, amount, entry_type, description)
VALUES (4, 6, 2000.00, 'debit', 'EUR deposit');

INSERT INTO transactions (user_id, transaction_type, description, amount, currency, to_account_id, status, transaction_date)
VALUES (3, 'deposit', 'Initial deposit', 750.00, 'USD', 9, 'completed', '2025-10-08 14:00:00');

INSERT INTO ledger_entries (transaction_id, account_id, amount, entry_type, description)
VALUES (5, 9, 750.00, 'debit', 'Initial deposit');

INSERT INTO transactions (user_id, transaction_type, description, amount, currency, to_account_id, status, transaction_date)
VALUES (3, 'deposit', 'EUR deposit', 300.00, 'EUR', 10, 'completed', '2025-10-08 14:05:00');

INSERT INTO ledger_entries (transaction_id, account_id, amount, entry_type, description)
VALUES (6, 10, 300.00, 'debit', 'EUR deposit');

INSERT INTO transactions (user_id, transaction_type, description, amount, currency, from_account_id, status, transaction_date)
VALUES (1, 'withdrawal', 'Grocery Store', 125.50, 'USD', 1, 'completed', '2025-10-15 11:30:00');

INSERT INTO ledger_entries (transaction_id, account_id, amount, entry_type, description)
VALUES (7, 1, -125.50, 'credit', 'Payment at Grocery Store');

INSERT INTO transactions (user_id, transaction_type, description, amount, currency, from_account_id, status, transaction_date)
VALUES (3, 'withdrawal', 'Gas Station', 45.00, 'USD', 9, 'completed', '2025-10-13 16:00:00');

INSERT INTO ledger_entries (transaction_id, account_id, amount, entry_type, description)
VALUES (8, 9, -45.00, 'credit', 'Gas Station payment');

INSERT INTO transactions (user_id, transaction_type, description, amount, currency, from_account_id, status, transaction_date)
VALUES (2, 'withdrawal', 'Netflix Subscription', 15.99, 'USD', 5, 'completed', '2025-10-12 08:00:00');

INSERT INTO ledger_entries (transaction_id, account_id, amount, entry_type, description)
VALUES (9, 5, -15.99, 'credit', 'Netflix monthly subscription');

INSERT INTO transactions (user_id, transaction_type, description, amount, currency, from_account_id, status, transaction_date)
VALUES (1, 'withdrawal', 'Coffee Shop', 5.75, 'USD', 1, 'completed', '2025-10-11 07:30:00');

INSERT INTO ledger_entries (transaction_id, account_id, amount, entry_type, description)
VALUES (10, 1, -5.75, 'credit', 'Morning coffee');

INSERT INTO transactions (user_id, transaction_type, description, amount, currency, from_account_id, to_account_id, status, transaction_date)
VALUES (2, 'transfer', 'Transfer to John', 200.00, 'USD', 5, 1, 'completed', '2025-10-14 12:00:00');

INSERT INTO ledger_entries (transaction_id, account_id, amount, entry_type, description) VALUES
(11, 5, -200.00, 'credit', 'Transfer sent to John'),
(11, 1, 200.00, 'debit', 'Transfer received from Jane');

INSERT INTO transactions (user_id, transaction_type, description, amount, currency, from_account_id, to_account_id, exchange_rate, converted_amount, status, transaction_date)
VALUES (1, 'exchange', 'USD to EUR exchange', 100.00, 'USD', 1, 2, 0.92, 92.00, 'completed', '2025-10-16 10:00:00');

INSERT INTO ledger_entries (transaction_id, account_id, amount, entry_type, description) VALUES
(12, 1, -100.00, 'credit', 'USD converted to EUR'),
(12, 2, 92.00, 'debit', 'EUR received from USD conversion');

ALTER TABLE ledger_entries ENABLE TRIGGER trigger_update_account_balance;
ALTER TABLE ledger_entries ENABLE TRIGGER trigger_validate_ledger_balance;

UPDATE accounts SET balance = (
    SELECT COALESCE(SUM(amount), 0)
    FROM ledger_entries
    WHERE account_id = accounts.id
);

SELECT 'Users Created:' as info, COUNT(*) as count FROM users;
SELECT 'Accounts Created:' as info, COUNT(*) as count FROM accounts;
SELECT 'Transactions Created:' as info, COUNT(*) as count FROM transactions;
SELECT 'Ledger Entries Created:' as info, COUNT(*) as count FROM ledger_entries;

SELECT 
    u.username,
    a.account_name,
    a.currency,
    a.balance,
    a.account_type,
    a.is_locked
FROM accounts a
JOIN users u ON a.user_id = u.id
ORDER BY u.id, a.currency, a.account_type;

SELECT 
    u.username,
    t.transaction_type,
    t.description,
    t.amount,
    t.currency,
    t.status,
    t.transaction_date
FROM transactions t
JOIN users u ON t.user_id = u.id
ORDER BY t.transaction_date DESC
LIMIT 10;
