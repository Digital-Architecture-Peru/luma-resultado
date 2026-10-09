export type NotificationType = "PURCHASE" | "PAYMENT_DUE" | "CARD_BLOCKED" | "LIMIT_REACHED";

export interface CardNotification {
  id: string;
  cardId: string;
  cardLast4: string;
  type: NotificationType;
  title: string;
  message: string;
  amount: number | null;
  currency: string;
  read: boolean;
  readAt: string | null;
  createdAt: string;
}

export interface Page<T> {
  items: T[];
  page: number;
  size: number;
  total: number;
}

export interface Preference {
  type: NotificationType;
  enabled: boolean;
}

export interface ListOptions {
  unreadOnly: boolean;
  page: number;
  size: number;
}
