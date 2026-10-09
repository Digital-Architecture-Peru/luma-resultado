import { TestBed } from '@angular/core/testing';
import { CardNotification } from '../domain/card-notification.model';
import { NotificationGateway } from '../domain/notification.gateway';
import { NotificationStore } from './notification-store.service';

function make(id: string, createdAt: string, read: boolean): CardNotification {
  return {
    id,
    cardAlias: 'Visa',
    cardLast4: '0000',
    type: 'PURCHASE',
    severity: 'info',
    title: `T-${id}`,
    message: 'm',
    createdAt,
    read,
  };
}

class FakeGateway extends NotificationGateway {
  constructor(private readonly behaviour: () => Promise<CardNotification[]>) {
    super();
  }
  override list(): Promise<CardNotification[]> {
    return this.behaviour();
  }
}

function createStore(behaviour: () => Promise<CardNotification[]>): NotificationStore {
  TestBed.configureTestingModule({
    providers: [{ provide: NotificationGateway, useValue: new FakeGateway(behaviour) }],
  });
  return TestBed.inject(NotificationStore);
}

const DATA = [
  make('a', '2026-10-01T10:00:00Z', true),
  make('b', '2026-10-03T10:00:00Z', false),
  make('c', '2026-10-02T10:00:00Z', false),
];

describe('NotificationStore', () => {
  it('given a successful gateway when load then status is success and items sorted newest first', async () => {
    const store = createStore(() => Promise.resolve(DATA));
    await store.load();
    expect(store.status()).toBe('success');
    expect(store.visible().map((n) => n.id)).toEqual(['b', 'c', 'a']);
    expect(store.unreadCount()).toBe(2);
  });

  it('given a failing gateway when load then status is error and list is empty', async () => {
    const store = createStore(() => Promise.reject(new Error('boom')));
    await store.load();
    expect(store.status()).toBe('error');
    expect(store.visible()).toEqual([]);
  });

  it('given loaded items when filtering unread then read ones are hidden', async () => {
    const store = createStore(() => Promise.resolve(DATA));
    await store.load();
    store.setFilter('unread');
    expect(store.visible().map((n) => n.id)).toEqual(['b', 'c']);
  });

  it('given an unread item when markAsRead then only that item changes', async () => {
    const store = createStore(() => Promise.resolve(DATA));
    await store.load();
    store.markAsRead('b');
    expect(store.unreadCount()).toBe(1);
    expect(store.visible().find((n) => n.id === 'c')?.read).toBe(false);
  });

  it('given unread items when markAllAsRead then unreadCount is zero', async () => {
    const store = createStore(() => Promise.resolve(DATA));
    await store.load();
    store.markAllAsRead();
    expect(store.unreadCount()).toBe(0);
  });
});
