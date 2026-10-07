import { writable, derived } from 'svelte/store';
import { assertSource } from '../ports/notificationSource.js';
import { mockSource } from '../adapters/mockSource.js';
import {
  sortByDate,
  unreadCount,
  markRead as markReadFn,
  markAllRead as markAllReadFn,
  isValidNotification
} from '../domain/notification.js';

/**
 * Crea un store en memoria (sin persistencia: se pierde al recargar).
 * @param {import('../ports/notificationSource.js').NotificationSource} source
 * @param {{maxItems?: number}} [options]
 */
export function createNotificationStore(source, options = {}) {
  assertSource(source);
  const max = Number.isInteger(options.maxItems) && options.maxItems > 0 ? options.maxItems : Infinity;
  const items = writable([]);
  const status = writable('idle'); // idle | loading | ready | error

  return {
    items: { subscribe: items.subscribe },
    status: { subscribe: status.subscribe },
    unread: derived(items, ($i) => unreadCount($i)),
    async load() {
      status.set('loading');
      try {
        const raw = await source.list();
        const valid = raw.filter(isValidNotification);
        items.set(sortByDate(valid).slice(0, max));
        status.set('ready');
      } catch {
        items.set([]);
        status.set('error');
      }
    },
    markRead(id) {
      items.update(($i) => markReadFn($i, id));
    },
    markAllRead() {
      items.update(($i) => markAllReadFn($i));
    }
  };
}

const envMax = Number.parseInt(import.meta.env?.VITE_MAX_ITEMS ?? '', 10);

export const notifications = createNotificationStore(mockSource, {
  maxItems: Number.isNaN(envMax) ? undefined : envMax
});
