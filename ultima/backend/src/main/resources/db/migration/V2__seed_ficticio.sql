-- Datos ficticios para desarrollo. No contienen PAN completos ni datos reales.
INSERT INTO card (id, customer_id, card_token, pan_last4, brand, type, status, alias,
                  credit_limit, available_balance, currency, expiry_month, expiry_year, cutoff_day)
VALUES
 ('11111111-1111-4111-8111-111111111111', 'cust-001', 'tok_demo_0001', '4242', 'VISA', 'CREDIT', 'ACTIVE',
  'Visa Platinum', 15000.00, 11250.50, 'USD', 8, 2028, 15),
 ('22222222-2222-4222-8222-222222222222', 'cust-001', 'tok_demo_0002', '1111', 'MASTERCARD', 'DEBIT', 'ACTIVE',
  'Débito Nómina', 3000.00, 2780.25, 'USD', 11, 2027, 1),
 ('33333333-3333-4333-8333-333333333333', 'cust-001', 'tok_demo_0003', '9876', 'VISA', 'CREDIT', 'BLOCKED',
  'Visa Clásica', 5000.00, 5000.00, 'USD', 3, 2026, 20),
 ('44444444-4444-4444-8444-444444444444', 'cust-002', 'tok_demo_0004', '5555', 'MASTERCARD', 'CREDIT', 'ACTIVE',
  'Mastercard Gold', 8000.00, 6400.00, 'USD', 1, 2029, 10);
