export type NotificationType = 'TRANSACTION' | 'PAYMENT_DUE' | 'LIMIT_REACHED' | 'CARD_BLOCKED';
export type NotificationStatus = 'UNREAD' | 'READ';

export interface CardNotification {
  readonly id: string;
  readonly cardRef: string;
  readonly last4: string;
  readonly type: NotificationType;
  readonly title: string;
  readonly message: string;
  readonly status: NotificationStatus;
  readonly createdAt: string;
  readonly readAt: string | null;
}

export interface Page<T> {
  readonly items: readonly T[];
  readonly page: number;
  readonly size: number;
  readonly total: number;
}

export interface UnreadCount {
  readonly count: number;
}
