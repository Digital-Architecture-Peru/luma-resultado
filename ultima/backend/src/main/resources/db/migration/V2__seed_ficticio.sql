-- Datos ficticios para demostración. No corresponden a personas ni cuentas reales.
INSERT INTO pago (cuenta_id, numero_cuenta, beneficiario, concepto, monto, moneda, estado, fecha_pago) VALUES
('CTA-0001', '001200451234', 'Empresa Eléctrica Demo',   'Servicio de luz septiembre',   85.40,  'USD', 'PROCESADO', '2026-09-02 10:15:00+00'),
('CTA-0001', '001200451234', 'Agua Potable Demo',        'Servicio de agua septiembre',  22.10,  'USD', 'PROCESADO', '2026-09-03 09:00:00+00'),
('CTA-0001', '001200451234', 'Telecom Demo',             'Plan de internet',             39.99,  'USD', 'PROCESADO', '2026-09-05 16:30:00+00'),
('CTA-0001', '001200451234', 'Colegio Ejemplo',          'Pensión octubre',              310.00, 'USD', 'PENDIENTE', '2026-10-01 08:00:00+00'),
('CTA-0001', '001200451234', 'Seguros Demo',             'Prima mensual',                64.75,  'USD', 'RECHAZADO', '2026-10-04 11:45:00+00'),
('CTA-0001', '001200451234', 'Tarjeta Demo',             'Pago mínimo tarjeta',          120.00, 'USD', 'PROCESADO', '2026-10-06 13:20:00+00'),
('CTA-0001', '001200451234', 'Gimnasio Ejemplo',         'Membresía trimestral',         150.00, 'USD', 'PENDIENTE', '2026-10-08 18:05:00+00'),
('CTA-0002', '009900876543', 'Otro Beneficiario Demo',   'Pago de otra cuenta',          999.99, 'USD', 'PROCESADO', '2026-10-02 12:00:00+00');
