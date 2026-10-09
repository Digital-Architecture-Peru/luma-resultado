import { TestBed } from '@angular/core/testing';
import { Observable, of, throwError } from 'rxjs';
import { NotificationGateway } from '../domain/notification.gateway';
import { PaymentNotification } from '../domain/notification.model';
import { NotificationStore } from './notification-store.service';

function sample(id: string, read: boolean): PaymentNotification {
  return {
    id,
    kind: 'payment-received',
    title: `t-${id}`,
    message: 'm',
    amountCents: 1000,
    currency: 'PEN',
    createdAt: '2026-10-09T09:00:00-05:00',
    read
  };
}

class FakeGateway extends NotificationGateway {
  constructor(private readonly result: Observable<PaymentNotification[]>) {
    super();
  }
  override list(): Observable<PaymentNotification[]> {
    return this.result;
  }
}

function createStore(result: Observable<PaymentNotification[]>): NotificationStore {
  TestBed.configureTestingModule({
    providers: [{ provide: NotificationGateway, useValue: new FakeGateway(result) }]
  });
  return TestBed.inject(NotificationStore);
}

describe('NotificationStore', () => {
  it('given a successful gateway when load then exposes items and unread count', () => {
    const store = createStore(of([sample('a', false), sample('b', true)]));
    store.load();
    expect(store.status()).toBe('success');
    expect(store.visibleItems()).toHaveLength(2);
    expect(store.unreadCount()).toBe(1);
  });

  it('given a failing gateway when load then status is error', () => {
    const store = createStore(throwError(() => new Error('boom')));
    store.load();
    expect(store.status()).toBe('error');
  });

  it('given unread filter when set then only unread items are visible', () => {
    const store = createStore(of([sample('a', false), sample('b', true)]));
    store.load();
    store.setFilter('unread');
    expect(store.visibleItems().map((n) => n.id)).toEqual(['a']);
  });

  it('given an unread item when markRead then it becomes read', () => {
    const store = createStore(of([sample('a', false)]));
    store.load();
    store.markRead('a');
    expect(store.unreadCount()).toBe(0);
  });

  it('given several unread items when markAllRead then unread count is zero', () => {
    const store = createStore(of([sample('a', false), sample('b', false)]));
    store.load();
    store.markAllRead();
    expect(store.unreadCount()).toBe(0);
  });
});
