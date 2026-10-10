import type { NotificationFilter, Page, PaymentNotification } from '../types/notification';

/** Puerto de acceso a notificaciones; implementado por HTTP y por un mock en memoria. */
export interface NotificationsApi {
  list(filter: NotificationFilter): Promise<Page<PaymentNotification>>;
  unreadCount(): Promise<number>;
  markAsRead(id: string): Promise<PaymentNotification>;
}
