export type NotificationType = 'PAGO_EXITOSO' | 'PAGO_RECHAZADO' | 'PAGO_PROGRAMADO_PROXIMO';
export type NotificationStatus = 'UNREAD' | 'READ';

export interface PaymentNotification {
  id: string;
  paymentReference: string;
  type: NotificationType;
  status: NotificationStatus;
  title: string;
  message: string;
  amount: number;
  currency: string;
  createdAt: string;
  readAt: string | null;
}

export interface NotificationPage {
  items: PaymentNotification[];
  total: number;
}
