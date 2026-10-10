-- Datos ficticios para desarrollo local. Cuentas enmascaradas; sin datos reales.
INSERT INTO notification (id, customer_id, payment_event_id, type, status, title, message, amount, currency, masked_account, created_at, read_at) VALUES
('11111111-1111-4111-8111-111111111111', 'CUST-0001', 'EVT-0001', 'PAYMENT_COMPLETED', 'UNREAD',
 'Pago realizado', 'Tu pago de 1,250.00 USD desde la cuenta ****1234 fue procesado.', 1250.00, 'USD', '****1234', now() - interval '2 hours', NULL),
('22222222-2222-4222-8222-222222222222', 'CUST-0001', 'EVT-0002', 'PAYMENT_REJECTED', 'UNREAD',
 'Pago rechazado', 'No pudimos procesar tu pago de 300.50 USD desde la cuenta ****1234.', 300.50, 'USD', '****1234', now() - interval '1 day', NULL),
('33333333-3333-4333-8333-333333333333', 'CUST-0001', 'EVT-0003', 'PAYMENT_SCHEDULED', 'READ',
 'Pago programado', 'Programamos tu pago de 75.00 USD desde la cuenta ****5678.', 75.00, 'USD', '****5678', now() - interval '3 days', now() - interval '2 days')
ON CONFLICT (customer_id, payment_event_id) DO NOTHING;
