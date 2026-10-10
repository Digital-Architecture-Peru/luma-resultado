export type NotificationType = 'PAYMENT_DONE' | 'PAYMENT_REJECTED' | 'PAYMENT_DUE';

export type NotificationFilter = 'unread' | 'all';

export interface PaymentNotification {
  id: string;
  paymentRef: string;
  type: NotificationType;
  title: string;
  body: string;
  amount: number;
  currency: string;
  createdAt: string;
  readAt: string | null;
}

export interface Page<T> {
  items: T[];
  total: number;
  page: number;
  size: number;
}
