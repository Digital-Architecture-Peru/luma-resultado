-- Datos ficticios para desarrollo. No contienen información real.
INSERT INTO account (id, masked_number) VALUES
    ('ACC-001', '****1234'),
    ('ACC-002', '****5678');

INSERT INTO notification (id, account_id, type, title, body, amount, currency, created_at, read_at) VALUES
    ('11111111-1111-4111-8111-111111111111', 'ACC-001', 'DEPOSIT', 'Depósito recibido',
     'Se acreditó un depósito en la cuenta ****1234.', 1250.50, 'USD', '2026-10-08T14:30:00Z', NULL),
    ('22222222-2222-4222-8222-222222222222', 'ACC-001', 'WITHDRAWAL', 'Retiro realizado',
     'Se realizó un retiro en cajero desde la cuenta ****1234.', 200.00, 'USD', '2026-10-07T09:10:00Z', '2026-10-07T10:00:00Z'),
    ('33333333-3333-4333-8333-333333333333', 'ACC-001', 'LOW_BALANCE', 'Saldo bajo',
     'El saldo de la cuenta ****1234 está por debajo del umbral configurado.', 45.20, 'USD', '2026-10-09T08:00:00Z', NULL),
    ('44444444-4444-4444-8444-444444444444', 'ACC-002', 'DEPOSIT', 'Depósito recibido',
     'Se acreditó un depósito en la cuenta ****5678.', 800.00, 'USD', '2026-10-06T16:45:00Z', NULL);

INSERT INTO notification_preference (account_id, type, enabled, threshold) VALUES
    ('ACC-001', 'DEPOSIT', TRUE, NULL),
    ('ACC-001', 'WITHDRAWAL', TRUE, NULL),
    ('ACC-001', 'LOW_BALANCE', TRUE, 100.00),
    ('ACC-002', 'LOW_BALANCE', FALSE, 50.00);
