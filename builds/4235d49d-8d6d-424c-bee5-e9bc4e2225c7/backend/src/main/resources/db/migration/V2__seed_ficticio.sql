-- Datos 100 % ficticios para desarrollo.
INSERT INTO account_notification (id, account_id, type, message, amount, read_at, created_at) VALUES
('11111111-1111-4111-8111-111111111111', '10001234', 'DEPOSIT',    'Depósito recibido en tu cuenta',       1500.00, NULL, now() - interval '1 hour'),
('22222222-2222-4222-8222-222222222222', '10001234', 'WITHDRAWAL', 'Retiro realizado en cajero',            200.00, NULL, now() - interval '5 hours'),
('33333333-3333-4333-8333-333333333333', '10001234', 'LOW_BALANCE','Tu saldo está por debajo del umbral',    80.50, now() - interval '1 day', now() - interval '2 days'),
('44444444-4444-4444-8444-444444444444', '20005678', 'DEPOSIT',    'Depósito recibido en tu cuenta',        320.00, NULL, now() - interval '3 hours');

INSERT INTO notification_preference (account_id, low_balance_threshold, deposit_enabled, withdrawal_enabled) VALUES
('10001234', 100.00, TRUE, TRUE),
('20005678', 250.00, TRUE, FALSE);
