export type NotificationType =
  | 'PurchaseApproved'
  | 'PurchaseDeclined'
  | 'CardBlocked'
  | 'CardUnblocked'
  | 'LimitChanged'
  | 'ExpiryUpcoming';

export type Severity = 'Info' | 'Warning' | 'Critical';

export type Channel = 'InApp' | 'Email' | 'Sms' | 'Push';

export interface CardNotification {
  id: string;
  cardLast4: string;
  type: NotificationType;
  title: string;
  body: string;
  severity: Severity;
  createdAt: string;
  readAt: string | null;
}

export interface NotificationPage {
  items: CardNotification[];
  unread: number;
  page: number;
  size: number;
}

export interface Preference {
  eventType: NotificationType;
  channel: Channel;
  enabled: boolean;
}

export type NotificationFilter = 'all' | 'unread';
