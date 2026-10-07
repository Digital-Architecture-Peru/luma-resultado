-- Datos ficticios para desarrollo local (solo perfil dev)
INSERT INTO cards (customer_id, pan_last4, brand, card_type, status, currency, credit_limit, available_balance, expiry_date) VALUES
('CLI-0001', '1111', 'VISA',       'CREDIT', 'ACTIVE',  'USD', 5000.00, 3200.50, '2028-05-31'),
('CLI-0001', '2222', 'MASTERCARD', 'DEBIT',  'ACTIVE',  'USD',    0.00,  850.00, '2027-11-30'),
('CLI-0001', '3333', 'VISA',       'CREDIT', 'BLOCKED', 'USD', 2000.00, 2000.00, '2026-12-31'),
('CLI-0002', '4444', 'MASTERCARD', 'CREDIT', 'ACTIVE',  'USD', 8000.00, 7100.25, '2029-02-28');
