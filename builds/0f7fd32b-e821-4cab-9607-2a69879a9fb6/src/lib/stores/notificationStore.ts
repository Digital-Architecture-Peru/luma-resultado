import { derived, get, writable, type Readable } from 'svelte/store';
import {
  applyFilter,
  countUnread,
  sortByRecent,
  type CardNotification,
  type NotificationFilter,
} from '../model/notification';
import type { NotificationGateway } from '../services/notificationGateway';

export type LoadStatus = 'idle' | 'loading' | 'success' | 'error';

export interface NotificationState {
  status: LoadStatus;
  items: CardNotification[];
  filter: NotificationFilter;
  error: string | null;
}

export interface NotificationStore {
  state: Readable<NotificationState>;
  visible: Readable<CardNotification[]>;
  unread: Readable<number>;
  load(): Promise<void>;
  markRead(id: string): Promise<void>;
  markAllRead(): Promise<void>;
  setFilter(filter: NotificationFilter): void;
}

function messageOf(e: unknown): string {
  return e instanceof Error ? e.message : 'Error desconocido';
}

export function createNotificationStore(gateway: NotificationGateway): NotificationStore {
  const state = writable<NotificationState>({
    status: 'idle',
    items: [],
    filter: 'all',
    error: null,
  });

  const visible = derived(state, ($s) => applyFilter(sortByRecent($s.items), $s.filter));
  const unread = derived(state, ($s) => countUnread($s.items));

  async function load(): Promise<void> {
    state.update((s) => ({ ...s, status: 'loading', error: null }));
    try {
      const items = await gateway.list();
      state.update((s) => ({ ...s, status: 'success', items }));
    } catch (e) {
      state.update((s) => ({ ...s, status: 'error', error: messageOf(e) }));
    }
  }

  async function markRead(id: string): Promise<void> {
    if (get(state).items.find((n) => n.id === id)?.read !== false) return;
    try {
      await gateway.markRead(id);
      state.update((s) => ({
        ...s,
        items: s.items.map((n) => (n.id === id ? { ...n, read: true } : n)),
      }));
    } catch (e) {
      state.update((s) => ({ ...s, error: messageOf(e) }));
    }
  }

  async function markAllRead(): Promise<void> {
    try {
      await gateway.markAllRead();
      state.update((s) => ({ ...s, items: s.items.map((n) => ({ ...n, read: true })) }));
    } catch (e) {
      state.update((s) => ({ ...s, error: messageOf(e) }));
    }
  }

  function setFilter(filter: NotificationFilter): void {
    state.update((s) => ({ ...s, filter }));
  }

  return { state, visible, unread, load, markRead, markAllRead, setFilter };
}
