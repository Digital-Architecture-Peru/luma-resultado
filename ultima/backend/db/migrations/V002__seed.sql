-- Datos ficticios para desarrollo local. Ningún dato real.
INSERT INTO notificacion (id, cliente_id, tarjeta_ref, ultimos4, tipo, titulo, mensaje, monto, moneda, leida, creada_en) VALUES
('11111111-1111-4111-8111-000000000001', 'cliente-demo', 'tok_demo_001', '4242', 'COMPRA',      'Compra aprobada',     'Compra en COMERCIO DEMO por 125.50',               125.50, 'USD', false, now() - interval '1 hour'),
('11111111-1111-4111-8111-000000000002', 'cliente-demo', 'tok_demo_001', '4242', 'LIMITE',      'Límite al 80%',       'Has usado el 80% de tu límite de crédito.',         NULL,  NULL,  false, now() - interval '1 day'),
('11111111-1111-4111-8111-000000000003', 'cliente-demo', 'tok_demo_001', '4242', 'VENCIMIENTO', 'Vence tu pago',      'Tu fecha de pago es en 3 días.',                    NULL,  NULL,  true,  now() - interval '2 days'),
('11111111-1111-4111-8111-000000000004', 'cliente-demo', 'tok_demo_001', '4242', 'PAGO',        'Pago recibido',       'Recibimos tu pago de 300.00.',                      300.00, 'USD', true,  now() - interval '5 days');

INSERT INTO preferencia_notificacion (cliente_id, tarjeta_ref, tipo, canal, habilitada, umbral_monto) VALUES
('cliente-demo', 'tok_demo_001', 'COMPRA',      'WEB', true,  50.00),
('cliente-demo', 'tok_demo_001', 'LIMITE',      'WEB', true,  NULL),
('cliente-demo', 'tok_demo_001', 'VENCIMIENTO', 'WEB', true,  NULL),
('cliente-demo', 'tok_demo_001', 'PAGO',        'WEB', false, NULL);
