-- Datos 100% ficticios para desarrollo local.
INSERT INTO cards (id, masked_pan, token, holder_alias, status) VALUES
    ('11111111-1111-4111-8111-111111111111', '**** **** **** 4242', 'tok_demo_0001', 'Cliente Demo Uno', 'ACTIVE'),
    ('22222222-2222-4222-8222-222222222222', '**** **** **** 1881', 'tok_demo_0002', 'Cliente Demo Dos', 'ACTIVE');

INSERT INTO card_transactions (id, card_id, amount, currency, status, idempotency_key, rejection_reason, created_at) VALUES
    ('aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa', '11111111-1111-4111-8111-111111111111', 150.00, 'USD', 'APPROVED', 'seed-key-000001', NULL, now() - interval '2 days'),
    ('bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb', '11111111-1111-4111-8111-111111111111', 9000.00, 'USD', 'REJECTED', 'seed-key-000002', 'El importe supera el límite permitido.', now() - interval '1 day');
