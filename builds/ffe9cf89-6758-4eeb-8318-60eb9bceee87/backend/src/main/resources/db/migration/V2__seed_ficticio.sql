-- Datos ficticios para desarrollo.
INSERT INTO card (id, customer_id, brand, alias, pan_last4) VALUES
    ('a0000000-0000-0000-0000-000000000001', 'CLI-0001', 'VISA',       'Visa Platinum',  '1111'),
    ('a0000000-0000-0000-0000-000000000002', 'CLI-0001', 'MASTERCARD', 'Mastercard Gold', '2222'),
    ('a0000000-0000-0000-0000-000000000003', 'CLI-0002', 'VISA',       'Visa Clásica',   '3333');

INSERT INTO notification (id, card_id, type, title, message, amount, currency, status, created_at, read_at) VALUES
    ('b0000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000001', 'COMPRA',
     'Compra en comercio ficticio', 'Se registró una compra en Tienda Demo.', 125.50, 'USD', 'UNREAD', now() - interval '1 hour', NULL),
    ('b0000000-0000-0000-0000-000000000002', 'a0000000-0000-0000-0000-000000000001', 'PAGO',
     'Pago recibido', 'Hemos recibido tu pago de la tarjeta.', 300.00, 'USD', 'READ', now() - interval '2 day', now() - interval '1 day'),
    ('b0000000-0000-0000-0000-000000000003', 'a0000000-0000-0000-0000-000000000001', 'VENCIMIENTO',
     'Fecha de pago próxima', 'Tu fecha de pago vence en 3 días.', NULL, NULL, 'UNREAD', now() - interval '3 hour', NULL),
    ('b0000000-0000-0000-0000-000000000004', 'a0000000-0000-0000-0000-000000000002', 'BLOQUEO',
     'Tarjeta bloqueada temporalmente', 'Bloqueo preventivo por actividad inusual (simulada).', NULL, NULL, 'UNREAD', now() - interval '30 minute', NULL),
    ('b0000000-0000-0000-0000-000000000005', 'a0000000-0000-0000-0000-000000000003', 'COMPRA',
     'Compra en línea', 'Compra en Tienda Online Demo.', 49.90, 'USD', 'UNREAD', now() - interval '5 hour', NULL);

INSERT INTO notification_preference (card_id, type, channel, enabled) VALUES
    ('a0000000-0000-0000-0000-000000000001', 'COMPRA', 'PUSH',  true),
    ('a0000000-0000-0000-0000-000000000001', 'COMPRA', 'EMAIL', true),
    ('a0000000-0000-0000-0000-000000000001', 'PAGO',   'EMAIL', true),
    ('a0000000-0000-0000-0000-000000000001', 'BLOQUEO', 'SMS',  true);
