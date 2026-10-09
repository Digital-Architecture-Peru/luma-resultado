-- Datos ficticios. Cuentas enmascaradas (solo últimos 4 dígitos).
INSERT INTO payment (id, customer_id, reference, beneficiary_name, beneficiary_account_masked, amount, currency, status, executed_at) VALUES
('11111111-1111-4111-8111-111111111101', 'CUST-0001', 'PAGO-0001', 'Empresa Eléctrica Demo', '****1234', 120.50, 'USD', 'COMPLETED', '2026-09-01T10:15:00Z'),
('11111111-1111-4111-8111-111111111102', 'CUST-0001', 'PAGO-0002', 'Agua Potable Demo',      '****5678',  35.00, 'USD', 'COMPLETED', '2026-09-05T14:30:00Z'),
('11111111-1111-4111-8111-111111111103', 'CUST-0001', 'PAGO-0003', 'Telecom Ficticia S.A.',  '****9012',  89.99, 'USD', 'PENDING',   NULL),
('11111111-1111-4111-8111-111111111104', 'CUST-0001', 'PAGO-0004', 'Colegio Ejemplo',        '****3456', 450.00, 'USD', 'REJECTED',  '2026-09-12T09:00:00Z'),
('11111111-1111-4111-8111-111111111105', 'CUST-0001', 'PAGO-0005', 'Seguros Demo',           '****7890', 210.75, 'USD', 'COMPLETED', '2026-09-20T16:45:00Z'),
('22222222-2222-4222-8222-222222222201', 'CUST-0002', 'PAGO-0101', 'Gimnasio Ficticio',      '****1111',  60.00, 'USD', 'COMPLETED', '2026-09-03T08:00:00Z');
