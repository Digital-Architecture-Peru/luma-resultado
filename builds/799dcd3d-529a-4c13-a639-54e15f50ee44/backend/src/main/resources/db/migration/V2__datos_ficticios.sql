-- Datos ficticios para desarrollo. No corresponden a clientes ni tarjetas reales.
INSERT INTO notificacion (tarjeta_id, ultimos4, tipo, mensaje, leida, creada_en) VALUES
    ('tarjeta-0001', '1111', 'CONSUMO',       'Consumo de 45.90 en COMERCIO DEMO A', FALSE, now() - INTERVAL '1 hour'),
    ('tarjeta-0001', '1111', 'PAGO_RECIBIDO', 'Recibimos tu pago de 300.00',         FALSE, now() - INTERVAL '1 day'),
    ('tarjeta-0001', '1111', 'VENCIMIENTO',   'Tu fecha de pago vence en 3 días',    TRUE,  now() - INTERVAL '2 days'),
    ('tarjeta-0001', '1111', 'CONSUMO',       'Consumo de 12.50 en COMERCIO DEMO B', TRUE,  now() - INTERVAL '3 days'),
    ('tarjeta-0002', '2222', 'BLOQUEO',       'Tu tarjeta fue bloqueada temporalmente', FALSE, now() - INTERVAL '5 hours'),
    ('tarjeta-0002', '2222', 'CONSUMO',       'Consumo de 99.00 en COMERCIO DEMO C', TRUE,  now() - INTERVAL '4 days');
