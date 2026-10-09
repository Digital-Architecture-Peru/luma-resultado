-- Datos ficticios para desarrollo. Fechas relativas a la ejecución para que entren en el rango por defecto (30 días).
INSERT INTO pagos (id, cuenta_id, referencia, beneficiario, monto, moneda, estado, fecha_pago, canal) VALUES
    ('a0000000-0000-4000-8000-000000000001', '0012345678', 'PAG-0001', 'Empresa Eléctrica Demo',   85.40, 'USD', 'PROCESADO', now() - interval '1 day',  'WEB'),
    ('a0000000-0000-4000-8000-000000000002', '0012345678', 'PAG-0002', 'Servicio de Agua Demo',    23.15, 'USD', 'PROCESADO', now() - interval '3 days', 'WEB'),
    ('a0000000-0000-4000-8000-000000000003', '0012345678', 'PAG-0003', 'Internet Hogar Demo',      49.99, 'USD', 'PENDIENTE', now() - interval '5 days', 'MOVIL'),
    ('a0000000-0000-4000-8000-000000000004', '0012345678', 'PAG-0004', 'Colegio Ejemplo',         320.00, 'USD', 'RECHAZADO', now() - interval '9 days', 'WEB'),
    ('a0000000-0000-4000-8000-000000000005', '0098765432', 'PAG-0005', 'Seguros Ficticios S.A.',  120.50, 'USD', 'PROCESADO', now() - interval '12 days', 'WEB'),
    ('a0000000-0000-4000-8000-000000000006', '0098765432', 'PAG-0006', 'Tienda Demo',              15.00, 'USD', 'ANULADO',   now() - interval '20 days', 'MOVIL'),
    ('a0000000-0000-4000-8000-000000000007', '0098765432', 'PAG-0007', 'Gimnasio Ejemplo',         35.00, 'USD', 'PROCESADO', now() - interval '40 days', 'WEB'),
    ('a0000000-0000-4000-8000-000000000008', '0055555555', 'PAG-0008', 'Otro Cliente Ficticio',   999.99, 'USD', 'PROCESADO', now() - interval '2 days',  'WEB');
