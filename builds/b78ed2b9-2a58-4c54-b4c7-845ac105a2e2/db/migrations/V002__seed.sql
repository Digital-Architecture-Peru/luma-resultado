-- Datos ficticios para desarrollo local.
INSERT INTO cards (id, masked_pan, alias, credit_limit, available_balance, currency) VALUES
    ('11111111-1111-4111-8111-111111111111', '**** 1234', 'Visa Platinum (demo)', 5000.00, 3200.00, 'USD'),
    ('22222222-2222-4222-8222-222222222222', '**** 9876', 'Mastercard Gold (demo)', 2000.00, 2000.00, 'USD');

INSERT INTO card_transactions (id, card_id, type, amount, currency, status, idempotency_key, created_at) VALUES
    ('aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa', '11111111-1111-4111-8111-111111111111', 'PAYMENT', 300.00, 'USD', 'APPROVED', 'seed-key-0001', now() - interval '10 days'),
    ('bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb', '11111111-1111-4111-8111-111111111111', 'PAYMENT', 150.00, 'USD', 'APPROVED', 'seed-key-0002', now() - interval '3 days');
