-- V002: datos ficticios para desarrollo local. No contiene datos reales.

INSERT INTO notification (id, customer_id, card_ref, card_last4, type, title, body, event_id, created_at, read_at) VALUES
  ('11111111-1111-4111-8111-111111111101', 'CLI-0001', 'tok-demo-4821', '4821', 'COMPRA',
   'Compra aprobada', 'Compra de 45.90 USD en COMERCIO DEMO.', 'evt-seed-001', now() - interval '15 minutes', NULL),
  ('11111111-1111-4111-8111-111111111102', 'CLI-0001', 'tok-demo-4821', '4821', 'PAGO_MINIMO',
   'Pago mínimo próximo', 'Tu pago mínimo vence en 3 días.', 'evt-seed-002', now() - interval '5 hours', NULL),
  ('11111111-1111-4111-8111-111111111103', 'CLI-0001', 'tok-demo-7730', '7730', 'VENCIMIENTO',
   'Tarjeta por vencer', 'Tu tarjeta vence el próximo mes.', 'evt-seed-003', now() - interval '1 day', now() - interval '20 hours'),
  ('11111111-1111-4111-8111-111111111104', 'CLI-0001', 'tok-demo-7730', '7730', 'BLOQUEO',
   'Tarjeta bloqueada', 'Bloqueaste temporalmente tu tarjeta.', 'evt-seed-004', now() - interval '2 days', NULL)
ON CONFLICT (event_id) DO NOTHING;

INSERT INTO notification_preference (customer_id, type, channel, enabled) VALUES
  ('CLI-0001', 'COMPRA', 'IN_APP', true),
  ('CLI-0001', 'COMPRA', 'EMAIL', true),
  ('CLI-0001', 'BLOQUEO', 'IN_APP', true),
  ('CLI-0001', 'BLOQUEO', 'SMS', true)
ON CONFLICT (customer_id, type, channel) DO NOTHING;
