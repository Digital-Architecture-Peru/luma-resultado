-- Datos 100% ficticios para demostración.
INSERT INTO pago (id, idempotency_key, cuenta_origen, cuenta_destino, monto, moneda, estado, creado_en) VALUES
  ('11111111-1111-4111-8111-111111111111', 'seed-0001', '0000-FAKE-0001', '0000-FAKE-0002', 150.00, 'USD', 'CONFIRMADO', now() - interval '2 days'),
  ('22222222-2222-4222-8222-222222222222', 'seed-0002', '0000-FAKE-0001', '0000-FAKE-0000', 75.50, 'USD', 'RECHAZADO', now() - interval '1 day'),
  ('33333333-3333-4333-8333-333333333333', 'seed-0003', '0000-FAKE-0003', '0000-FAKE-0001', 20.00, 'USD', 'CONFIRMADO', now() - interval '3 hours');
