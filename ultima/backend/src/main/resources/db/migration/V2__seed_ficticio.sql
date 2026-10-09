-- Datos ficticios para desarrollo local.
INSERT INTO payment (id, idempotency_key, source_account, beneficiary, amount, currency, status, reference, created_at) VALUES
('00000000-0000-0000-0000-000000000001', 'seed-0001', 'ES00-FAKE-0001', 'ES00-FAKE-9001', 120.50, 'EUR', 'COMPLETED', 'Alquiler ficticio', '2026-01-05T10:00:00Z'),
('00000000-0000-0000-0000-000000000002', 'seed-0002', 'ES00-FAKE-0001', 'ES00-FAKE-9002', 49.99, 'EUR', 'COMPLETED', 'Suscripcion ficticia', '2026-01-07T09:30:00Z'),
('00000000-0000-0000-0000-000000000003', 'seed-0003', 'ES00-FAKE-0002', 'ES00-FAKE-9003', 25000.00, 'EUR', 'REJECTED', 'Importe sobre el umbral', '2026-01-08T12:15:00Z');
