-- Datos ficticios para desarrollo. No contiene datos reales.
INSERT INTO payment_notifications (id, customer_id, payment_ref, type, title, body, amount, currency, created_at, read_at) VALUES
('00000000-0000-0000-0000-000000000001', 'CUST-001', '****1234', 'PAYMENT_DONE',     'Pago realizado',  'Tu pago de servicios fue procesado.',      120.50,  'PEN', now() - interval '2 hours',  NULL),
('00000000-0000-0000-0000-000000000002', 'CUST-001', '****5678', 'PAYMENT_REJECTED', 'Pago rechazado',  'Fondos insuficientes en la cuenta origen.', 1250.00, 'USD', now() - interval '26 hours', NULL),
('00000000-0000-0000-0000-000000000003', 'CUST-001', '****9012', 'PAYMENT_DUE',      'Pago por vencer', 'Tu cuota vence en 3 días.',                 340.00,  'PEN', now() - interval '2 days',   NULL),
('00000000-0000-0000-0000-000000000004', 'CUST-001', '****3456', 'PAYMENT_DONE',     'Pago realizado',  'Transferencia entre cuentas completada.',   80.00,   'PEN', now() - interval '5 days',   now() - interval '4 days'),
('00000000-0000-0000-0000-000000000005', 'CUST-002', '****7890', 'PAYMENT_DONE',     'Pago realizado',  'Pago de tarjeta aplicado.',                 560.75,  'PEN', now() - interval '1 day',    NULL);
