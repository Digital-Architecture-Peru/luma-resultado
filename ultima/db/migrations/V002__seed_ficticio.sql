-- V002: datos de ejemplo FICTICIOS (sin datos personales ni PAN reales).

INSERT INTO card_notification (id, customer_id, card_ref, card_last4, type, title, body, severity, created_at, read_at) VALUES
('11111111-1111-4111-8111-111111111111', 'CUST-DEMO-001', 'card_demo_01', '1234', 'PurchaseApproved',
 'Compra aprobada', 'Se aprobó una compra (S/ 45.90 en Comercio Demo) con la tarjeta terminada en 1234.', 'Info',
 now() - interval '10 minutes', NULL),
('22222222-2222-4222-8222-222222222222', 'CUST-DEMO-001', 'card_demo_01', '1234', 'PurchaseDeclined',
 'Compra rechazada', 'Se rechazó un intento de compra (S/ 1,200.00 en Tienda Ejemplo) con la tarjeta terminada en 1234.', 'Warning',
 now() - interval '3 hours', NULL),
('33333333-3333-4333-8333-333333333333', 'CUST-DEMO-001', 'card_demo_02', '9876', 'LimitChanged',
 'Cambio de límite', 'Se modificó el límite de tu tarjeta terminada en 9876 (nuevo límite S/ 5,000.00).', 'Info',
 now() - interval '1 day', now() - interval '20 hours'),
('44444444-4444-4444-8444-444444444444', 'CUST-DEMO-001', 'card_demo_02', '9876', 'ExpiryUpcoming',
 'Tarjeta por vencer', 'Tu tarjeta terminada en 9876 está próxima a vencer (vence el mes próximo).', 'Warning',
 now() - interval '2 days', NULL);

INSERT INTO notification_preference (customer_id, event_type, channel, enabled) VALUES
('CUST-DEMO-001', 'PurchaseApproved', 'InApp', true),
('CUST-DEMO-001', 'PurchaseApproved', 'Email', true),
('CUST-DEMO-001', 'CardBlocked', 'InApp', true),
('CUST-DEMO-001', 'CardBlocked', 'Sms', true);
