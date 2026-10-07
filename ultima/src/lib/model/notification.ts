export type NotificationType = 'purchase' | 'limit' | 'blocked' | 'payment_due';

export type NotificationFilter = 'all' | 'unread' | NotificationType;

export interface CardNotification {
  id: string;
  cardLast4: string;
  type: NotificationType;
  message: string;
  createdAt: string; // ISO 8601
  read: boolean;
}

export const TYPE_LABELS: Record<NotificationType, string> = {
  purchase: 'Compra',
  limit: 'Límite',
  blocked: 'Bloqueo',
  payment_due: 'Pago próximo',
};

export const FILTER_OPTIONS: ReadonlyArray<{ value: NotificationFilter; label: string }> = [
  { value: 'all', label: 'Todas' },
  { value: 'unread', label: 'No leídas' },
  { value: 'purchase', label: TYPE_LABELS.purchase },
  { value: 'limit', label: TYPE_LABELS.limit },
  { value: 'blocked', label: TYPE_LABELS.blocked },
  { value: 'payment_due', label: TYPE_LABELS.payment_due },
];

/** Enmascara la tarjeta mostrando solo los últimos 4 dígitos. */
export function maskCard(last4: string): string {
  if (!/^\d{4}$/.test(last4)) {
    throw new Error('Los últimos 4 dígitos de la tarjeta no son válidos');
  }
  return `•••• ${last4}`;
}

export function countUnread(items: readonly CardNotification[]): number {
  return items.filter((n) => !n.read).length;
}

/** Más recientes primero; no muta la entrada. */
export function sortByRecent(items: readonly CardNotification[]): CardNotification[] {
  return [...items].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export function applyFilter(
  items: readonly CardNotification[],
  filter: NotificationFilter,
): CardNotification[] {
  if (filter === 'all') return [...items];
  if (filter === 'unread') return items.filter((n) => !n.read);
  return items.filter((n) => n.type === filter);
}
