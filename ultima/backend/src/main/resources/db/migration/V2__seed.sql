-- Datos ficticios de demostración.
INSERT INTO card_notification (id, customer_ref, card_ref, last4, type, title, message, status, created_at, read_at) VALUES
('11111111-1111-4111-8111-000000000001', 'CUST-0001', 'CARD-TOK-0001', '4242', 'TRANSACTION',
 'Compra aprobada', 'Compra por 45.90 en COMERCIO DEMO.', 'UNREAD', now() - interval '1 hour', NULL),
('11111111-1111-4111-8111-000000000002', 'CUST-0001', 'CARD-TOK-0001', '4242', 'PAYMENT_DUE',
 'Pago próximo a vencer', 'Tu pago mínimo vence en 3 días.', 'UNREAD', now() - interval '1 day', NULL),
('11111111-1111-4111-8111-000000000003', 'CUST-0001', 'CARD-TOK-0001', '4242', 'LIMIT_REACHED',
 'Límite casi alcanzado', 'Has usado el 90% de tu línea de crédito.', 'READ', now() - interval '3 days', now() - interval '2 days'),
('11111111-1111-4111-8111-000000000004', 'CUST-0001', 'CARD-TOK-0002', '1881', 'CARD_BLOCKED',
 'Tarjeta bloqueada', 'Bloqueaste temporalmente tu tarjeta.', 'READ', now() - interval '7 days', now() - interval '6 days'),
('11111111-1111-4111-8111-000000000005', 'CUST-0002', 'CARD-TOK-0003', '0005', 'TRANSACTION',
 'Compra aprobada', 'Compra por 12.00 en TIENDA EJEMPLO.', 'UNREAD', now() - interval '2 hours', NULL);
