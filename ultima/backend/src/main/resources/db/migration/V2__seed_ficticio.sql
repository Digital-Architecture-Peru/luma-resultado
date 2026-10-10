-- Datos de ejemplo ficticios (sin datos personales reales).
INSERT INTO notification (id, customer_id, payment_id, type, title, message, amount, currency, account_last4, created_at, read_at) VALUES
('11111111-1111-4111-8111-111111111111', 'cust-demo-001', 'PAY-DEMO-0001', 'PAYMENT_SUCCEEDED',
 'Pago realizado', 'Tu pago de servicios fue procesado correctamente.', 125.50, 'USD', '1234',
 now() - interval '2 hours', NULL),
('22222222-2222-4222-8222-222222222222', 'cust-demo-001', 'PAY-DEMO-0002', 'PAYMENT_FAILED',
 'Pago rechazado', 'Fondos insuficientes para completar el pago.', 980.00, 'USD', '1234',
 now() - interval '1 day', NULL),
('33333333-3333-4333-8333-333333333333', 'cust-demo-001', 'PAY-DEMO-0003', 'PAYMENT_SCHEDULED',
 'Pago programado', 'Se debitará el próximo lunes.', 45.99, 'USD', '5678',
 now() - interval '3 days', now() - interval '2 days'),
('44444444-4444-4444-8444-444444444444', 'cust-demo-002', 'PAY-DEMO-0004', 'PAYMENT_SUCCEEDED',
 'Pago realizado', 'Transferencia a tercero completada.', 300.00, 'EUR', '9012',
 now() - interval '5 hours', NULL);
