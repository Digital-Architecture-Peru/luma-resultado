export type NotificationType = 'DEPOSIT' | 'WITHDRAWAL' | 'LOW_BALANCE' | 'STATEMENT';

export interface AccountNotification {
  id: string;
  accountMasked: string;
  type: NotificationType;
  title: string;
  message: string;
  createdAt: string;
  readAt: string | null;
  isRead: boolean;
}

export interface NotificationPreference {
  type: NotificationType;
  enabled: boolean;
}

export interface NotificationsApi {
  list(accountId: string, unreadOnly: boolean): Promise<AccountNotification[]>;
  markRead(id: string): Promise<void>;
  getPreferences(accountId: string): Promise<NotificationPreference[]>;
  savePreferences(accountId: string, preferences: NotificationPreference[]): Promise<void>;
}
