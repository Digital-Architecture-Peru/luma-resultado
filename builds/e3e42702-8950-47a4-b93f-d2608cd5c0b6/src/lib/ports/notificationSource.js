/**
 * Puerto de origen de notificaciones.
 * @typedef {Object} NotificationSource
 * @property {() => Promise<import('../domain/notification.js').Notification[]>} list
 */

/** Verifica que un objeto cumple el contrato del puerto. */
export function assertSource(source) {
  if (!source || typeof source.list !== 'function') {
    throw new TypeError('NotificationSource inválido: falta list()');
  }
  return source;
}
