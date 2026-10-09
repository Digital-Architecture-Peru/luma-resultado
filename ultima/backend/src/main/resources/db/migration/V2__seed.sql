-- Datos ficticios para desarrollo. No contienen información real.
INSERT INTO card (id, customer_id, last4, brand, credit_limit, balance, version) VALUES
    ('card-1', 'cust-001', '4242', 'VISA',       5000.00, 1250.50, 0),
    ('card-2', 'cust-001', '1881', 'MASTERCARD', 8000.00,  320.00, 0);

INSERT INTO account (id, customer_id, alias, balance, version) VALUES
    ('acc-1', 'cust-001', 'Cuenta de ahorros',   2500.00, 0),
    ('acc-2', 'cust-001', 'Cuenta corriente',      10.00, 0);

INSERT INTO card_transaction (id, card_id, type, amount, status, idempotency_key, created_at) VALUES
    ('tx-1', 'card-1', 'PURCHASE', 85.20,  'POSTED', NULL, '2026-09-28 10:15:00+00'),
    ('tx-2', 'card-1', 'PURCHASE', 410.00, 'POSTED', NULL, '2026-10-02 18:40:00+00'),
    ('tx-3', 'card-1', 'PAYMENT',  200.00, 'POSTED', 'seed-payment-001', '2026-10-05 09:00:00+00'),
    ('tx-4', 'card-2', 'PURCHASE', 320.00, 'POSTED', NULL, '2026-10-06 12:30:00+00');
