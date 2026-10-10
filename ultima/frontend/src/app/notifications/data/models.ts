export type NotificationType = 'PAYMENT_COMPLETED' | 'PAYMENT_REJECTED' | 'PAYMENT_SCHEDULED';
export type NotificationStatus = 'UNREAD' | 'READ';
export type StatusFilter = 'ALL' | NotificationStatus;

export interface AppNotification {
  id: string;
  type: NotificationType;
  status: NotificationStatus;
  title: string;
  message: string;
  amount: number;
  currency: string;
  maskedAccount: string;
  createdAt: string;
  readAt: string | null;
}
