export type NotificationSeverity = 'info' | 'warning' | 'critical';

export type NotificationType =
  | 'PURCHASE'
  | 'PAYMENT_DUE'
  | 'LIMIT_ALERT'
  | 'CARD_BLOCKED'
  | 'SECURITY';

export interface CardNotification {
  readonly id: string;
  readonly cardAlias: string;
  readonly cardLast4: string;
  readonly type: NotificationType;
  readonly severity: NotificationSeverity;
  readonly title: string;
  readonly message: string;
  /** Fecha ISO 8601. */
  readonly createdAt: string;
  readonly read: boolean;
}

export type NotificationFilter = 'all' | 'unread';

export type LoadStatus = 'idle' | 'loading' | 'success' | 'error';
