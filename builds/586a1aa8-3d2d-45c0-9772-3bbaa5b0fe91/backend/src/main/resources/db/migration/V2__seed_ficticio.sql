-- Datos 100% ficticios para desarrollo local.
INSERT INTO payment_notification
    (id, customer_id, payment_id, event_type, amount, currency, masked_account, status, created_at, read_at)
VALUES
    ('11111111-1111-4111-8111-111111111111', 'CUST-0001', 'PAY-1001', 'PAGO_EXITOSO',
     1250.50, 'USD', '****1234', 'UNREAD', now() - interval '10 minutes', NULL),
    ('22222222-2222-4222-8222-222222222222', 'CUST-0001', 'PAY-1002', 'PAGO_RECHAZADO',
     89.99, 'USD', '****1234', 'UNREAD', now() - interval '2 hours', NULL),
    ('33333333-3333-4333-8333-333333333333', 'CUST-0001', 'PAY-1003', 'PAGO_PROGRAMADO_PROXIMO',
     430.00, 'USD', '****9876', 'READ', now() - interval '1 day', now() - interval '20 hours'),
    ('44444444-4444-4444-8444-444444444444', 'CUST-0002', 'PAY-2001', 'PAGO_EXITOSO',
     15.00, 'EUR', '****5555', 'UNREAD', now() - interval '3 hours', NULL);

INSERT INTO notification_preference (customer_id, event_type, channel, enabled) VALUES
    ('CUST-0001', 'PAGO_EXITOSO', 'SMS', FALSE),
    ('CUST-0001', 'PAGO_PROGRAMADO_PROXIMO', 'EMAIL', TRUE),
    ('CUST-0002', 'PAGO_RECHAZADO', 'SMS', FALSE);
