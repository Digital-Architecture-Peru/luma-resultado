export type NotificationKind =
  | 'payment-received'
  | 'payment-failed'
  | 'payment-scheduled'
  | 'payment-due';

export type Severity = 'info' | 'success' | 'warning' | 'error';

export type LoadStatus = 'idle' | 'loading' | 'success' | 'error';

export type NotificationFilter = 'all' | 'unread';

export interface PaymentNotification {
  readonly id: string;
  readonly kind: NotificationKind;
  readonly title: string;
  readonly message: string;
  readonly amountCents: number;
  readonly currency: string;
  readonly createdAt: string;
  readonly read: boolean;
}

const SEVERITY_BY_KIND: Record<NotificationKind, Severity> = {
  'payment-received': 'success',
  'payment-failed': 'error',
  'payment-scheduled': 'info',
  'payment-due': 'warning'
};

const LABEL_BY_KIND: Record<NotificationKind, string> = {
  'payment-received': 'Recibido',
  'payment-failed': 'Fallido',
  'payment-scheduled': 'Programado',
  'payment-due': 'Por vencer'
};

export function severityOf(kind: NotificationKind): Severity {
  return SEVERITY_BY_KIND[kind];
}

export function labelOf(kind: NotificationKind): string {
  return LABEL_BY_KIND[kind];
}
