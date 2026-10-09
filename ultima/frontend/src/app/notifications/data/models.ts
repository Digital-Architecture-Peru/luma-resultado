export type NotificationType = 'Compra' | 'Bloqueo' | 'Vencimiento' | 'PagoMinimo';
export type Channel = 'InApp' | 'Email' | 'Sms' | 'Push';
export type BadgeTone = 'info' | 'warn' | 'danger' | 'neutral';
export type LoadState = 'idle' | 'loading' | 'success' | 'error';

export interface NotificationItem {
  id: string;
  cardLast4: string;
  type: NotificationType;
  title: string;
  body: string;
  createdAt: string;
  isRead: boolean;
}

export interface PagedNotifications {
  items: NotificationItem[];
  page: number;
  pageSize: number;
  total: number;
}

export interface Preference {
  type: NotificationType;
  channel: Channel;
  enabled: boolean;
}

export const NOTIFICATION_TYPES: readonly NotificationType[] = ['Compra', 'Bloqueo', 'Vencimiento', 'PagoMinimo'];
export const CHANNELS: readonly Channel[] = ['InApp', 'Email', 'Sms', 'Push'];

export const TYPE_LABELS: Record<NotificationType, string> = {
  Compra: 'Compra',
  Bloqueo: 'Bloqueo',
  Vencimiento: 'Vencimiento',
  PagoMinimo: 'Pago mínimo',
};

export const CHANNEL_LABELS: Record<Channel, string> = {
  InApp: 'En la app',
  Email: 'Correo',
  Sms: 'SMS',
  Push: 'Push',
};

const TYPE_TONES: Record<NotificationType, BadgeTone> = {
  Compra: 'info',
  Bloqueo: 'danger',
  Vencimiento: 'warn',
  PagoMinimo: 'warn',
};

export function typeTone(type: NotificationType): BadgeTone {
  return TYPE_TONES[type];
}

/** Enmascara la tarjeta: solo se muestran los últimos 4 dígitos. */
export function maskCard(last4: string): string {
  return `•••• ${last4}`;
}
