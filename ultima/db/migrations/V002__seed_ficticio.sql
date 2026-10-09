-- Datos ficticios para desarrollo. No contienen información real.
INSERT INTO accounts (number, holder, currency, balance) VALUES
    ('0010000001', 'Cliente Demo', 'USD', 1500.00),
    ('0010000002', 'Cliente Demo', 'USD', 320.50),
    ('0010000003', 'Cliente Demo', 'USD', 0.00)
ON CONFLICT (number) DO NOTHING;
