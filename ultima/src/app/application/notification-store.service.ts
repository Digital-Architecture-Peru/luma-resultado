import { Injectable, computed, inject, signal } from '@angular/core';
import { NotificationGateway } from '../domain/notification.gateway';
import {
  LoadStatus,
  NotificationFilter,
  PaymentNotification
} from '../domain/notification.model';

@Injectable({ providedIn: 'root' })
export class NotificationStore {
  private readonly gateway = inject(NotificationGateway);

  private readonly _items = signal<readonly PaymentNotification[]>([]);
  private readonly _status = signal<LoadStatus>('idle');
  private readonly _filter = signal<NotificationFilter>('all');

  readonly status = this._status.asReadonly();
  readonly filter = this._filter.asReadonly();
  readonly unreadCount = computed(() => this._items().filter((n) => !n.read).length);
  readonly visibleItems = computed(() =>
    this._filter() === 'unread' ? this._items().filter((n) => !n.read) : this._items()
  );

  load(): void {
    this._status.set('loading');
    this.gateway.list().subscribe({
      next: (items) => {
        this._items.set(items);
        this._status.set('success');
      },
      error: () => this._status.set('error')
    });
  }

  setFilter(filter: NotificationFilter): void {
    this._filter.set(filter);
  }

  markRead(id: string): void {
    this._items.update((items) => items.map((n) => (n.id === id ? { ...n, read: true } : n)));
  }

  markAllRead(): void {
    this._items.update((items) => items.map((n) => ({ ...n, read: true })));
  }
}
