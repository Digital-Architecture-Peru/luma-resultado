export type NotificationType = 'DEPOSIT' | 'WITHDRAWAL' | 'LOW_BALANCE';

export interface AccountNotification {
  id: string;
  accountId: string;
  type: NotificationType;
  title: string;
  message: string;
  createdAt: string;
  read: boolean;
}

export interface NotificationPage {
  items: AccountNotification[];
  total: number;
}

export type NotificationStatusFilter = 'all' | 'unread';
