-- Datos ficticios de ejemplo
INSERT INTO payments (id, origin_account, beneficiary, amount, currency, concept, status, idempotency_key, created_at) VALUES
('11111111-1111-4111-8111-111111111111', '00012345678901', 'Empresa Luz Demo S.A.', 120.50, 'PEN', 'Recibo de luz', 'CONFIRMADO', 'seed-0001', now() - interval '3 days'),
('22222222-2222-4222-8222-222222222222', '00012345678901', 'Agua Demo S.A.', 45.00, 'PEN', 'Recibo de agua', 'CONFIRMADO', 'seed-0002', now() - interval '2 days'),
('33333333-3333-4333-8333-333333333333', '00098765432100', 'Colegio Ejemplo', 300.00, 'USD', 'Pension mensual', 'RECHAZADO', 'seed-0003', now() - interval '1 day');
