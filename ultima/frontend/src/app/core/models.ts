export type NotificationType = 'DEPOSIT' | 'WITHDRAWAL' | 'LOW_BALANCE';

export interface AccountNotification {
  id: string;
  accountId: string;
  type: NotificationType;
  title: string;
  body: string;
  amount: number | null;
  currency: string | null;
  createdAt: string;
  readAt: string | null;
}

export interface PageResult<T> {
  items: T[];
  page: number;
  size: number;
  total: number;
}

export interface NotificationPreference {
  type: NotificationType;
  enabled: boolean;
  threshold: number | null;
}

export interface ListOptions {
  unreadOnly: boolean;
  page: number;
  size: number;
}
