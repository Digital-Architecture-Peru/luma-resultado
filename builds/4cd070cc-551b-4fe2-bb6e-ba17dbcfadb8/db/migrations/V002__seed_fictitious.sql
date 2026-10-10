-- Datos ficticios: cuentas enmascaradas, sin información real.
INSERT INTO account_notification (id, customer_id, account_id, type, title, message, created_at, read_at) VALUES
('11111111-1111-1111-1111-111111111101', 'CUST-001', 'ACC-001', 'DEPOSIT',    'Depósito recibido',  'Se acreditó un depósito en la cuenta ****1234.',          now() - interval '1 hour',  NULL),
('11111111-1111-1111-1111-111111111102', 'CUST-001', 'ACC-001', 'WITHDRAWAL', 'Retiro realizado',   'Se registró un retiro en cajero desde la cuenta ****1234.', now() - interval '1 day',   NULL),
('11111111-1111-1111-1111-111111111103', 'CUST-001', 'ACC-001', 'LOW_BALANCE','Saldo bajo',         'El saldo de la cuenta ****1234 está por debajo del mínimo.', now() - interval '3 days',  now() - interval '2 days'),
('11111111-1111-1111-1111-111111111104', 'CUST-002', 'ACC-002', 'DEPOSIT',    'Depósito recibido',  'Se acreditó un depósito en la cuenta ****5678.',          now() - interval '2 hours', NULL);
