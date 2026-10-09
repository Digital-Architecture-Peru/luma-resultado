-- Datos ficticios para demostración. No contienen datos personales ni números de tarjeta reales.
-- Tarjeta A: 11111111-1111-4111-8111-111111111111 (terminada en 4242)
-- Tarjeta B: 22222222-2222-4222-8222-222222222222 (terminada en 1881)
INSERT INTO card_notification (id, card_id, card_last4, type, title, message, amount, read_at, created_at) VALUES
('a0000000-0000-4000-8000-000000000001', '11111111-1111-4111-8111-111111111111', '4242', 'PURCHASE',
 'Compra aprobada', 'Compra en COMERCIO DEMO con tu tarjeta terminada en 4242.', 150.00, NULL, now() - interval '15 minutes'),
('a0000000-0000-4000-8000-000000000002', '11111111-1111-4111-8111-111111111111', '4242', 'PURCHASE',
 'Compra aprobada', 'Compra en TIENDA EJEMPLO con tu tarjeta terminada en 4242.', 89.90, now() - interval '1 hour', now() - interval '2 hours'),
('a0000000-0000-4000-8000-000000000003', '11111111-1111-4111-8111-111111111111', '4242', 'PAYMENT_DUE',
 'Pago próximo a vencer', 'Tu pago mínimo vence en 3 días.', 120.00, NULL, now() - interval '1 day'),
('a0000000-0000-4000-8000-000000000004', '11111111-1111-4111-8111-111111111111', '4242', 'LIMIT_REACHED',
 'Línea casi agotada', 'Has utilizado el 90% de tu línea de crédito.', NULL, NULL, now() - interval '2 days'),
('a0000000-0000-4000-8000-000000000005', '11111111-1111-4111-8111-111111111111', '4242', 'CARD_BLOCKED',
 'Tarjeta bloqueada temporalmente', 'Bloqueaste tu tarjeta desde Banca por Internet.', NULL, now() - interval '9 days', now() - interval '10 days'),
('a0000000-0000-4000-8000-000000000006', '22222222-2222-4222-8222-222222222222', '1881', 'PURCHASE',
 'Compra aprobada', 'Compra en SERVICIO DEMO con tu tarjeta terminada en 1881.', 45.50, NULL, now() - interval '3 hours'),
('a0000000-0000-4000-8000-000000000007', '22222222-2222-4222-8222-222222222222', '1881', 'PAYMENT_DUE',
 'Pago registrado', 'Recibimos tu pago. Gracias.', 300.00, now() - interval '4 days', now() - interval '5 days');

INSERT INTO notification_preference (card_id, type, enabled) VALUES
('11111111-1111-4111-8111-111111111111', 'PURCHASE', TRUE),
('11111111-1111-4111-8111-111111111111', 'PAYMENT_DUE', TRUE),
('11111111-1111-4111-8111-111111111111', 'CARD_BLOCKED', TRUE),
('11111111-1111-4111-8111-111111111111', 'LIMIT_REACHED', FALSE);
