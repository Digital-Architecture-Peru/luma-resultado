-- Datos ficticios para desarrollo. No corresponden a personas ni tarjetas reales.
INSERT INTO card (id, customer_id, pan_last4, masked_pan, brand, card_type, status, credit_limit, available_balance, currency)
VALUES
 ('11111111-1111-4111-8111-111111111111', 'CUST-0001', '1111', '**** **** **** 1111', 'VISA', 'CREDIT', 'ACTIVE', 5000.00, 3250.75, 'USD'),
 ('22222222-2222-4222-8222-222222222222', 'CUST-0001', '2222', '**** **** **** 2222', 'MASTERCARD', 'DEBIT', 'ACTIVE', NULL, 1280.40, 'USD'),
 ('33333333-3333-4333-8333-333333333333', 'CUST-0001', '3333', '**** **** **** 3333', 'VISA', 'CREDIT', 'BLOCKED', 2000.00, 0.00, 'USD'),
 ('44444444-4444-4444-8444-444444444444', 'CUST-0002', '4444', '**** **** **** 4444', 'MASTERCARD', 'CREDIT', 'ACTIVE', 8000.00, 7900.00, 'USD');
