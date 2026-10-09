export const NOTIFICATION_TYPES = ['COMPRA', 'PAGO', 'VENCIMIENTO', 'BLOQUEO'] as const;
export const CHANNELS = ['PUSH', 'EMAIL', 'SMS'] as const;

export type NotificationType = (typeof NOTIFICATION_TYPES)[number];
export type Channel = (typeof CHANNELS)[number];
export type NotificationStatus = 'UNREAD' | 'READ';

export interface Card {
  id: string;
  brand: string;
  alias: string;
  panLast4: string;
}

export interface CardNotification {
  id: string;
  cardId: string;
  type: NotificationType;
  title: string;
  message: string;
  amount: number | null;
  currency: string | null;
  status: NotificationStatus;
  createdAt: string;
  readAt: string | null;
}

export interface NotificationPage {
  items: CardNotification[];
  page: number;
  size: number;
  total: number;
}

export interface Preference {
  type: NotificationType;
  channel: Channel;
  enabled: boolean;
}

export const TYPE_LABELS: Record<NotificationType, string> = {
  COMPRA: 'Compra',
  PAGO: 'Pago',
  VENCIMIENTO: 'Vencimiento',
  BLOQUEO: 'Bloqueo',
};

export const CHANNEL_LABELS: Record<Channel, string> = {
  PUSH: 'Push',
  EMAIL: 'Correo',
  SMS: 'SMS',
};
