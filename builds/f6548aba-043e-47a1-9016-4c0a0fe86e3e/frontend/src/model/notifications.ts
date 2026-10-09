import type { Channel, NotificationType, Preference, Severity } from '../api/types';

export const EVENT_LABELS: Record<NotificationType, string> = {
  PurchaseApproved: 'Compra aprobada',
  PurchaseDeclined: 'Compra rechazada',
  CardBlocked: 'Bloqueo de tarjeta',
  CardUnblocked: 'Desbloqueo de tarjeta',
  LimitChanged: 'Cambio de límite',
  ExpiryUpcoming: 'Vencimiento próximo',
};

export const CHANNEL_LABELS: Record<Channel, string> = {
  InApp: 'En la banca',
  Email: 'Correo',
  Sms: 'SMS',
  Push: 'Push',
};

export const SEVERITY_LABELS: Record<Severity, string> = {
  Info: 'Informativa',
  Warning: 'Atención',
  Critical: 'Crítica',
};

export const EVENT_ORDER = Object.keys(EVENT_LABELS) as NotificationType[];
export const CHANNEL_ORDER = Object.keys(CHANNEL_LABELS) as Channel[];

const LOCKED_EVENTS: NotificationType[] = ['CardBlocked', 'CardUnblocked', 'PurchaseDeclined'];

/** Debe coincidir con PreferenceRules.IsLocked del backend: avisos de seguridad no desactivables. */
export function isLocked(eventType: NotificationType, channel: Channel): boolean {
  return channel === 'InApp' && LOCKED_EVENTS.includes(eventType);
}

export function setPreference(
  preferences: Preference[],
  eventType: NotificationType,
  channel: Channel,
  enabled: boolean,
): Preference[] {
  return preferences.map((p) =>
    p.eventType === eventType && p.channel === channel ? { ...p, enabled } : p,
  );
}

export function formatDate(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return '';
  return new Intl.DateTimeFormat('es-PE', { dateStyle: 'medium', timeStyle: 'short' }).format(date);
}

export function maskedCard(last4: string): string {
  return `•••• ${last4}`;
}
