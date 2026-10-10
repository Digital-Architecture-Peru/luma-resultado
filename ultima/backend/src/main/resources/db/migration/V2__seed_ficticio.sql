-- Datos ficticios para desarrollo local. No contienen datos personales reales.
INSERT INTO payment_notification
    (id, customer_id, payment_reference, type, status, title, message, amount, currency, created_at, read_at)
VALUES
    ('11111111-1111-4111-8111-111111111111', 'CUST-0001', 'PAY-2026-0001', 'PAGO_EXITOSO', 'UNREAD',
     'Pago exitoso', 'Tu pago PAY-2026-0001 por USD 125.50 desde la cuenta ****7890 fue procesado.',
     125.50, 'USD', now() - interval '2 hours', NULL),
    ('22222222-2222-4222-8222-222222222222', 'CUST-0001', 'PAY-2026-0002', 'PAGO_RECHAZADO', 'UNREAD',
     'Pago rechazado', 'Tu pago PAY-2026-0002 por USD 980.00 desde la cuenta ****7890 fue rechazado.',
     980.00, 'USD', now() - interval '1 day', NULL),
    ('33333333-3333-4333-8333-333333333333', 'CUST-0001', 'PAY-2026-0003', 'PAGO_PROGRAMADO_PROXIMO', 'READ',
     'Pago programado próximo', 'Tu pago PAY-2026-0003 por USD 45.00 desde la cuenta ****7890 se ejecutará pronto.',
     45.00, 'USD', now() - interval '3 days', now() - interval '2 days');
