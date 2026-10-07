import { describe, it, expect } from 'vitest';
import { get } from 'svelte/store';
import { createNotificationStore } from '../src/lib/stores/notificationStore';
import {
  InMemoryNotificationGateway,
  type NotificationGateway,
} from '../src/lib/services/notificationGateway';

describe('notificationStore', () => {
  it('given datos when load then estado success y orden por fecha', async () => {
    const store = createNotificationStore(new InMemoryNotificationGateway());
    await store.load();
    expect(get(store.state).status).toBe('success');
    expect(get(store.visible)[0].id).toBe('n-1');
    expect(get(store.unread)).toBe(2);
  });

  it('given una no leída when markRead then baja el contador', async () => {
    const store = createNotificationStore(new InMemoryNotificationGateway());
    await store.load();
    await store.markRead('n-1');
    expect(get(store.unread)).toBe(1);
  });

  it('given no leídas when markAllRead then contador en 0', async () => {
    const store = createNotificationStore(new InMemoryNotificationGateway());
    await store.load();
    await store.markAllRead();
    expect(get(store.unread)).toBe(0);
  });

  it('given filtro when setFilter then visible se reduce', async () => {
    const store = createNotificationStore(new InMemoryNotificationGateway());
    await store.load();
    store.setFilter('blocked');
    expect(get(store.visible).map((n) => n.id)).toEqual(['n-4']);
  });

  it('given gateway que falla when load then estado error con mensaje', async () => {
    const failing: NotificationGateway = {
      list: () => Promise.reject(new Error('sin servicio')),
      markRead: () => Promise.resolve(),
      markAllRead: () => Promise.resolve(),
    };
    const store = createNotificationStore(failing);
    await store.load();
    const s = get(store.state);
    expect(s.status).toBe('error');
    expect(s.error).toBe('sin servicio');
  });
});
