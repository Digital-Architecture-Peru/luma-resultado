-- V002: datos ficticios de ejemplo (no corresponden a personas ni cuentas reales)
INSERT INTO payments (id, customer_id, source_account_id, beneficiary_account, amount, currency, concept, status, failure_reason, idempotency_key, created_at, processed_at)
VALUES
 ('11111111-1111-4111-8111-111111111111', 'C-1001', '00100000000001', '00200000000002', 150.75, 'PEN', 'Pago de servicio de agua', 'COMPLETED', NULL, 'seed-0001', '2026-01-10T15:00:00Z', '2026-01-10T15:00:01Z'),
 ('22222222-2222-4222-8222-222222222222', 'C-1001', '00100000000001', '00300000000000', 80.00, 'PEN', 'Pago a tercero', 'REJECTED', 'Cuenta destino no habilitada para recibir pagos.', 'seed-0002', '2026-01-11T09:30:00Z', '2026-01-11T09:30:01Z');
