import { TestBed } from '@angular/core/testing';
import { Observable, of, throwError } from 'rxjs';
import { describe, expect, it } from 'vitest';
import { NotificationStore } from './notification.store';
import { AccountNotification } from '../domain/notification.model';
import { NotificationRepository } from '../domain/notification.repository';
import { makeNotification } from '../testing/factories';

class FakeRepository extends NotificationRepository {
  constructor(private readonly result: Observable<AccountNotification[]>) {
    super();
  }
  override list(): Observable<AccountNotification[]> {
    return this.result;
  }
}

function createStore(result: Observable<AccountNotification[]>): NotificationStore {
  TestBed.configureTestingModule({
    providers: [{ provide: NotificationRepository, useValue: new FakeRepository(result) }],
  });
  return TestBed.inject(NotificationStore);
}

const DATA = [
  makeNotification({ id: 'a', read: false }),
  makeNotification({ id: 'b', read: true }),
  makeNotification({ id: 'c', read: false }),
];

describe('NotificationStore', () => {
  it('given a successful repository, when load, then state is success and unread counted', () => {
    const store = createStore(of(DATA));
    store.load();
    expect(store.state()).toBe('success');
    expect(store.visible()).toHaveLength(3);
    expect(store.unreadCount()).toBe(2);
  });

  it('given a failing repository, when load, then state is error', () => {
    const store = createStore(throwError(() => new Error('fallo')));
    store.load();
    expect(store.state()).toBe('error');
  });

  it('given the unread filter, when applied, then only unread are visible', () => {
    const store = createStore(of(DATA));
    store.load();
    store.setFilter('unread');
    expect(store.visible().map((n) => n.id)).toEqual(['a', 'c']);
  });

  it('given an unread item, when markRead, then unread count decreases', () => {
    const store = createStore(of(DATA));
    store.load();
    store.markRead('a');
    expect(store.unreadCount()).toBe(1);
  });

  it('given unread items, when markAllRead, then unread count is zero', () => {
    const store = createStore(of(DATA));
    store.load();
    store.markAllRead();
    expect(store.unreadCount()).toBe(0);
  });

  it('given an item, when dismiss, then it is removed', () => {
    const store = createStore(of(DATA));
    store.load();
    store.dismiss('b');
    expect(store.visible().map((n) => n.id)).toEqual(['a', 'c']);
  });
});
