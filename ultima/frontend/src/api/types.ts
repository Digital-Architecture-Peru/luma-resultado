export type NotificationType = "PAYMENT_SUCCEEDED" | "PAYMENT_FAILED" | "PAYMENT_SCHEDULED";

export interface NotificationDto {
  id: string;
  paymentId: string;
  type: NotificationType;
  title: string;
  message: string;
  amount: number;
  currency: string;
  accountLast4: string;
  createdAt: string;
  readAt: string | null;
}

/** Puerto de datos del front: la UI depende de esta interfaz, no de fetch. */
export interface NotificationsApi {
  list(status: "unread" | "all", limit?: number): Promise<NotificationDto[]>;
  unreadCount(): Promise<number>;
  markRead(id: string): Promise<void>;
}
