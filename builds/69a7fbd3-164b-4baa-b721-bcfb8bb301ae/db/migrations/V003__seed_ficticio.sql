-- Datos 100% ficticios para desarrollo. Cliente demo: 11111111-1111-1111-1111-111111111111
INSERT INTO cards (id, customer_id, last4, brand, product, status, credit_limit, available, currency, expiry_month, expiry_year) VALUES
('aaaaaaaa-0000-0000-0000-000000000001', '11111111-1111-1111-1111-111111111111', '4242', 'VISA', 'Clásica', 'Active', 5000.00, 3200.50, 'USD', 7, 2028),
('aaaaaaaa-0000-0000-0000-000000000002', '11111111-1111-1111-1111-111111111111', '5555', 'MASTERCARD', 'Oro', 'Blocked', 9000.00, 150.00, 'USD', 11, 2027),
('aaaaaaaa-0000-0000-0000-000000000003', '11111111-1111-1111-1111-111111111111', '0007', 'VISA', 'Platinum', 'Expired', 15000.00, 15000.00, 'USD', 2, 2024),
('bbbbbbbb-0000-0000-0000-000000000001', '22222222-2222-2222-2222-222222222222', '1111', 'VISA', 'Clásica', 'Active', 3000.00, 2900.00, 'USD', 5, 2029);

INSERT INTO card_movements (id, card_id, posted_at, description, amount, currency) VALUES
('cccccccc-0000-0000-0000-000000000001', 'aaaaaaaa-0000-0000-0000-000000000001', '2026-09-28T14:30:00Z', 'Supermercado Demo', 85.40, 'USD'),
('cccccccc-0000-0000-0000-000000000002', 'aaaaaaaa-0000-0000-0000-000000000001', '2026-09-30T09:10:00Z', 'Restaurante Ejemplo', 42.10, 'USD'),
('cccccccc-0000-0000-0000-000000000003', 'aaaaaaaa-0000-0000-0000-000000000001', '2026-10-01T18:45:00Z', 'Tienda Online Ficticia', 310.00, 'USD'),
('cccccccc-0000-0000-0000-000000000004', 'aaaaaaaa-0000-0000-0000-000000000001', '2026-10-02T08:00:00Z', 'Pago recibido', -500.00, 'USD'),
('cccccccc-0000-0000-0000-000000000005', 'aaaaaaaa-0000-0000-0000-000000000001', '2026-10-03T20:15:00Z', 'Cine Demo', 24.00, 'USD'),
('cccccccc-0000-0000-0000-000000000006', 'aaaaaaaa-0000-0000-0000-000000000001', '2026-10-05T12:20:00Z', 'Estación de servicio Demo', 55.00, 'USD'),
('cccccccc-0000-0000-0000-000000000007', 'aaaaaaaa-0000-0000-0000-000000000002', '2026-09-15T10:00:00Z', 'Farmacia Ejemplo', 18.75, 'USD');
