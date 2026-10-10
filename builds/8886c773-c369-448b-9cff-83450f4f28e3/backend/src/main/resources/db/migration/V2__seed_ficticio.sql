-- Datos ficticios: no corresponden a personas ni cuentas reales
INSERT INTO account (id, customer_id, masked_number) VALUES
  ('acc-001', 'cust-001', '****1234'),
  ('acc-002', 'cust-001', '****5678'),
  ('acc-003', 'cust-002', '****9012');

INSERT INTO notification (id, account_id, type, title, message, status, created_at) VALUES
  ('11111111-1111-4111-8111-111111111111', 'acc-001', 'CREDIT', 'Abono recibido',
   'Se acreditaron 1,250.00 a la cuenta ****1234.', 'UNREAD', now() - interval '1 hour'),
  ('22222222-2222-4222-8222-222222222222', 'acc-001', 'DEBIT', 'Cargo realizado',
   'Se debitaron 85.40 de la cuenta ****1234.', 'UNREAD', now() - interval '3 hours'),
  ('33333333-3333-4333-8333-333333333333', 'acc-001', 'LOW_BALANCE', 'Saldo bajo',
   'El saldo de la cuenta ****1234 está por debajo de su umbral.', 'READ', now() - interval '1 day'),
  ('44444444-4444-4444-8444-444444444444', 'acc-002', 'CREDIT', 'Abono recibido',
   'Se acreditaron 300.00 a la cuenta ****5678.', 'UNREAD', now() - interval '2 hours'),
  ('55555555-5555-4555-8555-555555555555', 'acc-003', 'DEBIT', 'Cargo realizado',
   'Se debitaron 20.00 de la cuenta ****9012.', 'UNREAD', now() - interval '5 hours');

INSERT INTO notification_preference (account_id, type, channel, enabled, threshold_amount) VALUES
  ('acc-001', 'CREDIT', 'IN_APP', TRUE, NULL),
  ('acc-001', 'DEBIT', 'IN_APP', TRUE, NULL),
  ('acc-001', 'LOW_BALANCE', 'IN_APP', TRUE, 100.00),
  ('acc-002', 'CREDIT', 'IN_APP', TRUE, NULL);
