-- Datos ficticios para desarrollo local.
INSERT INTO card (id, masked_pan, holder_alias, status, credit_limit, available_balance, version) VALUES
  ('11111111-1111-1111-1111-111111111111', '**** **** **** 1234', 'Cliente Demo Uno', 'ACTIVE', 5000.00, 3200.00, 0),
  ('22222222-2222-2222-2222-222222222222', '**** **** **** 9876', 'Cliente Demo Dos', 'BLOCKED', 2000.00, 2000.00, 0);

INSERT INTO card_transaction (id, card_id, type, amount, currency, description, status, idempotency_key, created_at) VALUES
  ('aaaaaaaa-0000-0000-0000-000000000001', '11111111-1111-1111-1111-111111111111', 'PURCHASE', 120.50, 'USD', 'Supermercado Demo', 'APPROVED', 'seed-0001', now() - interval '2 day'),
  ('aaaaaaaa-0000-0000-0000-000000000002', '11111111-1111-1111-1111-111111111111', 'PAYMENT', 300.00, 'USD', 'Pago de tarjeta', 'APPROVED', 'seed-0002', now() - interval '1 day');
