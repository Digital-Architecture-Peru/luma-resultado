-- Datos 100 % ficticios para desarrollo local.
INSERT INTO payment_notification
    (customer_id, payment_reference, type, amount, currency, masked_account, status, created_at, read_at)
VALUES
    ('CUST-001', 'PAY-0001', 'PAYMENT_SUCCESS',   125.50, 'USD', '****1234', 'UNREAD', now() - interval '1 hour', NULL),
    ('CUST-001', 'PAY-0002', 'PAYMENT_FAILED',     80.00, 'USD', '****1234', 'UNREAD', now() - interval '3 hours', NULL),
    ('CUST-001', 'PAY-0003', 'PAYMENT_SCHEDULED', 300.00, 'USD', '****9876', 'READ',   now() - interval '1 day', now() - interval '20 hours'),
    ('CUST-002', 'PAY-0004', 'PAYMENT_SUCCESS',    45.75, 'USD', '****5555', 'UNREAD', now() - interval '2 hours', NULL);
