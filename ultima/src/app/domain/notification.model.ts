export type NotificationKind = 'low-balance' | 'deposit' | 'withdrawal' | 'security';

export type NotificationFilter = 'all' | 'unread';

export interface AccountNotification {
  readonly id: string;
  readonly accountAlias: string;
  readonly kind: NotificationKind;
  readonly title: string;
  readonly message: string;
  readonly createdAt: string;
  readonly read: boolean;
}

export type LoadState = 'idle' | 'loading' | 'success' | 'error';

export const KIND_LABELS: Record<NotificationKind, string> = {
  'low-balance': 'Saldo bajo',
  deposit: 'Depósito',
  withdrawal: 'Retiro',
  security: 'Seguridad',
};

export type BadgeTone = 'info' | 'success' | 'warning' | 'danger';

export const KIND_TONES: Record<NotificationKind, BadgeTone> = {
  'low-balance': 'warning',
  deposit: 'success',
  withdrawal: 'info',
  security: 'danger',
};
