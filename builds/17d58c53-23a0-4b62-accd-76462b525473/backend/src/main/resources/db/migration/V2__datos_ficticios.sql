-- Datos ficticios para desarrollo. Cuenta de ejemplo: 0011223344 (se muestra como ****3344).
INSERT INTO notificacion (id, cuenta_id, tipo, mensaje, monto, leida, creada_en) VALUES
    ('00000000-0000-0000-0000-000000000001', '0011223344', 'ABONO',      'Abono recibido en tu cuenta',            1500.00, FALSE, now() - INTERVAL '1 hour'),
    ('00000000-0000-0000-0000-000000000002', '0011223344', 'CARGO',      'Cargo por compra con tarjeta de débito',  89.90, FALSE, now() - INTERVAL '5 hours'),
    ('00000000-0000-0000-0000-000000000003', '0011223344', 'SALDO_BAJO', 'Tu saldo disponible es menor al umbral',   NULL, TRUE,  now() - INTERVAL '1 day'),
    ('00000000-0000-0000-0000-000000000004', '0011223344', 'CARGO',      'Cargo por pago de servicio',             230.00, TRUE,  now() - INTERVAL '2 days'),
    ('00000000-0000-0000-0000-000000000005', '5566778899', 'ABONO',      'Abono por transferencia',                400.00, FALSE, now() - INTERVAL '3 hours');

INSERT INTO preferencia_notificacion (cuenta_id, tipo, canal, activo, umbral_monto) VALUES
    ('0011223344', 'ABONO',      'APP',   TRUE,  NULL),
    ('0011223344', 'ABONO',      'EMAIL', FALSE, 100.00),
    ('0011223344', 'CARGO',      'APP',   TRUE,  50.00),
    ('0011223344', 'CARGO',      'SMS',   TRUE,  200.00),
    ('0011223344', 'SALDO_BAJO', 'EMAIL', TRUE,  NULL);
