-- Datos 100% ficticios para demostracion.
INSERT INTO tarjeta (cliente_id, ultimos4, tipo, estado) VALUES
    ('cli-001', '1111', 'DEBITO',  'ACTIVA'),
    ('cli-001', '2222', 'CREDITO', 'ACTIVA'),
    ('cli-001', '3333', 'CREDITO', 'BLOQUEADA'),
    ('cli-002', '4444', 'DEBITO',  'ACTIVA');

INSERT INTO transaccion (id, tarjeta_id, monto, moneda, estado, idempotency_key, creado_en) VALUES
    ('11111111-1111-4111-8111-111111111111', 1, 120.50, 'USD', 'APROBADA',  'seed-0001', now() - interval '2 days'),
    ('22222222-2222-4222-8222-222222222222', 1, 9999.00, 'USD', 'RECHAZADA', 'seed-0002', now() - interval '1 day');
