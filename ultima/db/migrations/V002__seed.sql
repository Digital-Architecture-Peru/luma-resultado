-- Datos ficticios para desarrollo local.
INSERT INTO accounts (id, number, holder, currency, balance) VALUES
    ('11111111-1111-4111-8111-111111111111', 'ACC00000001', 'Ana Ficticia', 'USD', 2500.00),
    ('22222222-2222-4222-8222-222222222222', 'ACC00000002', 'Ana Ficticia', 'USD', 120.50),
    ('33333333-3333-4333-8333-333333333333', 'ACC00000003', 'Ana Ficticia', 'EUR', 900.00)
ON CONFLICT (id) DO NOTHING;
