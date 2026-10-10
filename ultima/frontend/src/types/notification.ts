export type NotificationType = 'PAYMENT_SUCCESS' | 'PAYMENT_FAILED' | 'PAYMENT_SCHEDULED';
export type NotificationStatus = 'UNREAD' | 'READ';

export interface PaymentNotification {
  id: number;
  customerId: string;
  paymentReference: string;
  type: NotificationType;
  amount: number;
  currency: string;
  maskedAccount: string;
  status: NotificationStatus;
  createdAt: string;
  readAt: string | null;
}
