import { AccountNotification } from '../domain/notification.model';

export function makeNotification(
  overrides: Partial<AccountNotification> = {},
): AccountNotification {
  return {
    id: 'n-x',
    accountAlias: 'Cuenta de prueba ****0000',
    kind: 'deposit',
    title: 'Depósito recibido',
    message: 'Mensaje de prueba',
    createdAt: '2026-10-09T08:00:00Z',
    read: false,
    ...overrides,
  };
}
