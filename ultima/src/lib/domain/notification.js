/**
 * @typedef {'compra'|'pago_proximo'|'bloqueo'|'limite'} NotificationType
 * @typedef {Object} Notification
 * @property {string} id
 * @property {NotificationType} type
 * @property {string} cardLast4  Últimos 4 dígitos (nunca el PAN completo)
 * @property {string} title
 * @property {string} body
 * @property {number} [amount]
 * @property {string} createdAt  ISO 8601
 * @property {boolean} read
 */

export const NOTIFICATION_TYPES = ['compra', 'pago_proximo', 'bloqueo', 'limite'];

/**
 * Enmascara una tarjeta usando solo los últimos 4 dígitos.
 * @param {string} value
 * @returns {string}
 */
export function maskCard(value) {
  const digits = String(value ?? '').replace(/\D/g, '');
  if (digits.length < 4) return '•••• ----';
  return `•••• ${digits.slice(-4)}`;
}

/** Ordena de más reciente a más antigua sin mutar. */
export function sortByDate(items) {
  return [...items].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
}

export function unreadCount(items) {
  return items.filter((n) => !n.read).length;
}

export function markRead(items, id) {
  return items.map((n) => (n.id === id ? { ...n, read: true } : n));
}

export function markAllRead(items) {
  return items.map((n) => (n.read ? n : { ...n, read: true }));
}

/** Valida estructura mínima de una notificación. */
export function isValidNotification(n) {
  return (
    !!n &&
    typeof n.id === 'string' &&
    n.id.length > 0 &&
    NOTIFICATION_TYPES.includes(n.type) &&
    typeof n.cardLast4 === 'string' &&
    typeof n.title === 'string' &&
    typeof n.body === 'string' &&
    !Number.isNaN(new Date(n.createdAt).getTime()) &&
    typeof n.read === 'boolean'
  );
}

/** Formatea monto en moneda ficticia. */
export function formatAmount(amount) {
  if (typeof amount !== 'number' || Number.isNaN(amount)) return '';
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'USD'
  }).format(amount);
}
