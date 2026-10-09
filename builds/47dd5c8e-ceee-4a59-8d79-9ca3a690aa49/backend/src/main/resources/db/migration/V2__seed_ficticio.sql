-- Datos ficticios. Cuentas ya enmascaradas; no corresponden a personas reales.
INSERT INTO pago (id, cliente_id, cuenta_origen_mask, beneficiario, monto, moneda, estado, fecha_pago) VALUES
('00000000-0000-4000-8000-000000000001', 'CLI-0001', '****-****-0123', 'Empresa de Luz Demo',      85.40, 'USD', 'PROCESADO', '2026-09-01T10:15:00Z'),
('00000000-0000-4000-8000-000000000002', 'CLI-0001', '****-****-0123', 'Agua Potable Demo',        32.10, 'USD', 'PROCESADO', '2026-09-03T09:00:00Z'),
('00000000-0000-4000-8000-000000000003', 'CLI-0001', '****-****-0123', 'Internet Hogar Demo',      49.99, 'USD', 'PROCESADO', '2026-09-05T14:30:00Z'),
('00000000-0000-4000-8000-000000000004', 'CLI-0001', '****-****-0456', 'Colegio Ejemplo',        250.00, 'USD', 'PROCESADO', '2026-09-08T16:45:00Z'),
('00000000-0000-4000-8000-000000000005', 'CLI-0001', '****-****-0123', 'Seguro Vida Demo',        60.00, 'USD', 'RECHAZADO', '2026-09-10T08:20:00Z'),
('00000000-0000-4000-8000-000000000006', 'CLI-0001', '****-****-0456', 'Tarjeta Comercial Demo', 310.75, 'USD', 'PROCESADO', '2026-09-15T11:00:00Z'),
('00000000-0000-4000-8000-000000000007', 'CLI-0001', '****-****-0123', 'Telefonia Movil Demo',    25.00, 'USD', 'PROCESADO', '2026-09-20T19:10:00Z'),
('00000000-0000-4000-8000-000000000008', 'CLI-0001', '****-****-0123', 'Condominio Ejemplo',     120.00, 'USD', 'PENDIENTE', '2026-10-01T07:45:00Z'),
('00000000-0000-4000-8000-000000000009', 'CLI-0001', '****-****-0456', 'Proveedor Servicios Demo', 980.50, 'USD', 'PENDIENTE', '2026-10-05T13:05:00Z'),
('00000000-0000-4000-8000-000000000010', 'CLI-0001', '****-****-0123', 'Gimnasio Demo',            40.00, 'USD', 'RECHAZADO', '2026-10-06T18:00:00Z'),
('00000000-0000-4000-8000-000000000011', 'CLI-0002', '****-****-0789', 'Alquiler Demo',           450.00, 'USD', 'PROCESADO', '2026-09-02T12:00:00Z'),
('00000000-0000-4000-8000-000000000012', 'CLI-0002', '****-****-0789', 'Supermercado Demo',        76.30, 'USD', 'PENDIENTE', '2026-10-04T10:30:00Z');
