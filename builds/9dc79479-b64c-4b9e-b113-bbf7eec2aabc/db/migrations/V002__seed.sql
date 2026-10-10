-- V002: datos ficticios de demostración (sin datos personales reales)
INSERT INTO account_notification (id, account_id, customer_id, type, title, message, created_at, read_at) VALUES
    ('00000000-0000-4000-8000-000000000001', '10020030041234', 'CUST-0001', 'DEPOSIT',
     'Depósito recibido', 'Se acreditó un depósito en la cuenta ****1234.', now() - interval '2 hours', NULL),
    ('00000000-0000-4000-8000-000000000002', '10020030041234', 'CUST-0001', 'WITHDRAWAL',
     'Retiro realizado', 'Se registró un retiro en la cuenta ****1234.', now() - interval '1 day', NULL),
    ('00000000-0000-4000-8000-000000000003', '10020030041234', 'CUST-0001', 'LOW_BALANCE',
     'Saldo bajo', 'El saldo de la cuenta ****1234 está por debajo del umbral configurado.', now() - interval '2 days', NULL),
    ('00000000-0000-4000-8000-000000000004', '10020030041234', 'CUST-0001', 'STATEMENT',
     'Estado de cuenta disponible', 'Ya puedes consultar el estado de cuenta de ****1234.', now() - interval '5 days', now() - interval '4 days')
ON CONFLICT (id) DO NOTHING;

INSERT INTO notification_preference (account_id, type, customer_id, enabled) VALUES
    ('10020030041234', 'DEPOSIT', 'CUST-0001', TRUE),
    ('10020030041234', 'WITHDRAWAL', 'CUST-0001', TRUE),
    ('10020030041234', 'LOW_BALANCE', 'CUST-0001', TRUE),
    ('10020030041234', 'STATEMENT', 'CUST-0001', TRUE)
ON CONFLICT (account_id, type) DO NOTHING;
