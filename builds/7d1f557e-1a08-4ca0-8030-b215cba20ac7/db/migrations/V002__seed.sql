-- Datos ficticios. Cuentas enmascaradas; sin datos personales reales.
INSERT INTO pagos (id, cliente_id, referencia, beneficiario, cuenta_destino_mask, monto, moneda, estado, fecha_pago, canal) VALUES
('00000000-0000-4000-8000-000000000001', 'CLI-0001', 'PAG-0001', 'Servicios Eléctricos Demo',  '****1001',  150.75, 'PEN', 'APLICADO',  now() - interval '1 day',   'WEB'),
('00000000-0000-4000-8000-000000000002', 'CLI-0001', 'PAG-0002', 'Agua Potable Demo',          '****1002',   89.90, 'PEN', 'APLICADO',  now() - interval '3 days',  'WEB'),
('00000000-0000-4000-8000-000000000003', 'CLI-0001', 'PAG-0003', 'Telefonía Demo',             '****1003',  120.00, 'PEN', 'PENDIENTE', now() - interval '4 days',  'MOVIL'),
('00000000-0000-4000-8000-000000000004', 'CLI-0001', 'PAG-0004', 'Colegio Ficticio',           '****1004', 1500.00, 'PEN', 'APLICADO',  now() - interval '6 days',  'WEB'),
('00000000-0000-4000-8000-000000000005', 'CLI-0001', 'PAG-0005', 'Seguro Demo',                '****1005',  320.40, 'USD', 'RECHAZADO', now() - interval '8 days',  'WEB'),
('00000000-0000-4000-8000-000000000006', 'CLI-0001', 'PAG-0006', 'Alquiler Ficticio S.A.',     '****1006', 2200.00, 'PEN', 'APLICADO',  now() - interval '10 days', 'WEB'),
('00000000-0000-4000-8000-000000000007', 'CLI-0001', 'PAG-0007', 'Internet Demo',              '****1007',  109.90, 'PEN', 'APLICADO',  now() - interval '12 days', 'MOVIL'),
('00000000-0000-4000-8000-000000000008', 'CLI-0001', 'PAG-0008', 'Gas Natural Demo',           '****1008',   45.30, 'PEN', 'PENDIENTE', now() - interval '15 days', 'WEB'),
('00000000-0000-4000-8000-000000000009', 'CLI-0001', 'PAG-0009', 'Tienda Ficticia',            '****1009',  780.00, 'PEN', 'RECHAZADO', now() - interval '18 days', 'WEB'),
('00000000-0000-4000-8000-000000000010', 'CLI-0001', 'PAG-0010', 'Universidad Demo',           '****1010',  950.00, 'USD', 'APLICADO',  now() - interval '22 days', 'WEB'),
('00000000-0000-4000-8000-000000000011', 'CLI-0001', 'PAG-0011', 'Club Deportivo Demo',        '****1011',   60.00, 'PEN', 'APLICADO',  now() - interval '40 days', 'MOVIL'),
('00000000-0000-4000-8000-000000000012', 'CLI-0002', 'PAG-0012', 'Otro Cliente Demo',          '****2001',  500.00, 'PEN', 'APLICADO',  now() - interval '2 days',  'WEB');
