import { describe, expect, it, vi } from 'vitest';
import { NotificationsStore } from './notifications.store';
import type { NotificationsGateway } from './notifications.api';
import type { NotificationItem, PagedNotifications, Preference } from './models';

const item = (id: string, isRead = false): NotificationItem => ({
  id,
  cardLast4: '1234',
  type: 'Compra',
  title: 'Compra aprobada',
  body: 'Compra ficticia',
  createdAt: '2026-01-15T10:00:00Z',
  isRead,
});

const page = (items: NotificationItem[]): PagedNotifications => ({ items, page: 1, pageSize: 20, total: items.length });

function makeGateway(overrides: Partial<NotificationsGateway> = {}): NotificationsGateway {
  return {
    list: vi.fn(async () => page([item('a'), item('b', true)])),
    markRead: vi.fn(async () => undefined),
    getPreferences: vi.fn(async (): Promise<Preference[]> => [{ type: 'Compra', channel: 'Email', enabled: false }]),
    savePreferences: vi.fn(async (p: Preference[]) => p),
    ...overrides,
  };
}

describe('NotificationsStore', () => {
  it('given a successful list when loading then state is success and unread count is computed', async () => {
    const store = new NotificationsStore(makeGateway());

    await store.load();

    expect(store.state()).toBe('success');
    expect(store.items()).toHaveLength(2);
    expect(store.unreadCount()).toBe(1);
  });

  it('given a failing list when loading then state is error', async () => {
    const store = new NotificationsStore(makeGateway({ list: vi.fn(async () => { throw new Error('boom'); }) }));

    await store.load();

    expect(store.state()).toBe('error');
  });

  it('given unreadOnly when toggled then the gateway is called with the filter', async () => {
    const gateway = makeGateway();
    const store = new NotificationsStore(gateway);

    await store.setUnreadOnly(true);

    expect(gateway.list).toHaveBeenCalledWith(true, 1);
  });

  it('given an unread item when marked read then it is flagged as read', async () => {
    const store = new NotificationsStore(makeGateway());
    await store.load();

    await store.markRead('a');

    expect(store.items().find((i) => i.id === 'a')?.isRead).toBe(true);
    expect(store.unreadCount()).toBe(0);
  });

  it('given unreadOnly filter when marked read then the item is removed from the list', async () => {
    const store = new NotificationsStore(makeGateway());
    await store.setUnreadOnly(true);

    await store.markRead('a');

    expect(store.items().some((i) => i.id === 'a')).toBe(false);
  });

  it('given a failing markRead when marking then the item stays unread and a message is shown', async () => {
    const store = new NotificationsStore(makeGateway({ markRead: vi.fn(async () => { throw new Error('boom'); }) }));
    await store.load();

    await store.markRead('a');

    expect(store.items().find((i) => i.id === 'a')?.isRead).toBe(false);
    expect(store.message()).not.toBe('');
  });

  it('given loaded preferences when toggled and saved then the gateway receives the change', async () => {
    const gateway = makeGateway();
    const store = new NotificationsStore(gateway);
    await store.loadPreferences();

    store.togglePreference('Compra', 'Email');
    await store.savePreferences();

    expect(gateway.savePreferences).toHaveBeenCalledWith([{ type: 'Compra', channel: 'Email', enabled: true }]);
    expect(store.saving()).toBe(false);
    expect(store.message()).toBe('Preferencias guardadas.');
  });
});
