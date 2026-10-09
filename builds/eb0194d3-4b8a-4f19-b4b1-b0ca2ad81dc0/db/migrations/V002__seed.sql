-- Datos ficticios para desarrollo. Deben coincidir con DemoCards.cs.
INSERT INTO cards (id, customer_id, product_name, brand, masked_pan, last4, status, credit_limit, available_balance, currency, expiry)
VALUES
    ('11111111-1111-1111-1111-111111111101', 'demo-001', 'Visa Platinum',   'VISA',       '**** **** **** 4821', '4821', 'ACTIVE',  15000.00, 11250.75, 'USD', '12/28'),
    ('11111111-1111-1111-1111-111111111102', 'demo-001', 'Mastercard Gold', 'MASTERCARD', '**** **** **** 0937', '0937', 'BLOCKED',  8000.00,  2300.10, 'USD', '05/27'),
    ('11111111-1111-1111-1111-111111111103', 'demo-002', 'Visa Classic',    'VISA',       '**** **** **** 1156', '1156', 'ACTIVE',  3000.00,  2750.00, 'PEN', '09/29')
ON CONFLICT (id) DO NOTHING;
