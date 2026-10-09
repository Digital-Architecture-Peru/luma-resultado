-- Datos ficticios. PAN siempre enmascarado.
INSERT INTO card (id, customer_id, masked_pan, brand, status, credit_limit, available_balance) VALUES
    ('11111111-1111-1111-1111-111111111111', 'cust-demo-001', '****1234', 'VISA', 'ACTIVE', 5000.00, 3200.00),
    ('22222222-2222-2222-2222-222222222222', 'cust-demo-001', '****5678', 'MASTERCARD', 'ACTIVE', 2000.00, 150.00),
    ('33333333-3333-3333-3333-333333333333', 'cust-demo-001', '****9012', 'VISA', 'BLOCKED', 1000.00, 1000.00);
