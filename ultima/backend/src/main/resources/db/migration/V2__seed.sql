-- Datos ficticios para desarrollo local
INSERT INTO card (id, customer_id, alias, last4, type, status, credit_limit, available_balance, currency, expiry_date) VALUES
('11111111-1111-4111-8111-111111111111', 'CUST-1001', 'Visa Platinum', '4821', 'CREDIT', 'ACTIVE',  15000.00,  9820.55, 'USD', '2028-09-30'),
('22222222-2222-4222-8222-222222222222', 'CUST-1001', 'Debito Sueldo', '1034', 'DEBIT',  'ACTIVE',      0.00,  1234.50, 'USD', '2027-03-31'),
('33333333-3333-4333-8333-333333333333', 'CUST-1001', 'Mastercard Gold', '7790', 'CREDIT', 'BLOCKED', 8000.00,  8000.00, 'USD', '2026-12-31'),
('44444444-4444-4444-8444-444444444444', 'CUST-2002', 'Visa Clasica',  '5566', 'CREDIT', 'EXPIRED',  3000.00,   150.00, 'USD', '2025-01-31');
