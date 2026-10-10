export type EventType = 'PAGO_EXITOSO' | 'PAGO_RECHAZADO' | 'PAGO_PROGRAMADO_PROXIMO';
export type Channel = 'IN_APP' | 'EMAIL' | 'SMS';
export type NotificationStatus = 'UNREAD' | 'READ';

export interface PaymentNotification {
  id: string;
  paymentId: string;
  eventType: EventType;
  amount: number;
  currency: string;
  maskedAccount: string;
  status: NotificationStatus;
  createdAt: string;
  readAt: string | null;
}

export interface Page<T> {
  items: T[];
  page: number;
  size: number;
  totalElements: number;
}

export interface Preference {
  eventType: EventType;
  channel: Channel;
  enabled: boolean;
}

export const EVENT_TYPES: readonly EventType[] = [
  'PAGO_EXITOSO',
  'PAGO_RECHAZADO',
  'PAGO_PROGRAMADO_PROXIMO',
];

export const EVENT_LABELS: Record<EventType, string> = {
  PAGO_EXITOSO: 'Pago exitoso',
  PAGO_RECHAZADO: 'Pago rechazado',
  PAGO_PROGRAMADO_PROXIMO: 'Pago programado próximo',
};

export const CHANNEL_LABELS: Record<Channel, string> = {
  IN_APP: 'Bandeja',
  EMAIL: 'Correo (simulado)',
  SMS: 'SMS (simulado)',
};

export const API_BASE = '/api/v1';
/** Cliente ficticio: sustituto de autenticación (fuera de alcance, no apto para producción). */
export const CUSTOMER_ID = 'CUST-0001';
export const POLL_INTERVAL_MS = 30000;
