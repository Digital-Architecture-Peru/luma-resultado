export type NotificationType = 'DEPOSIT' | 'WITHDRAWAL' | 'LOW_BALANCE';
export type StatusFilter = 'ALL' | 'UNREAD';

export interface AccountNotification {
  id: string;
  account: string;
  type: NotificationType;
  message: string;
  amount: number | null;
  read: boolean;
  createdAt: string;
}

export interface NotificationPreferences {
  account: string;
  lowBalanceThreshold: number;
  depositEnabled: boolean;
  withdrawalEnabled: boolean;
  updatedAt: string;
}

export interface PreferencesUpdate {
  lowBalanceThreshold: number;
  depositEnabled: boolean;
  withdrawalEnabled: boolean;
}
