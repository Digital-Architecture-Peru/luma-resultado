import { Injectable, computed, inject, signal } from '@angular/core';
import {
  CardNotification,
  LoadStatus,
  NotificationFilter,
} from '../domain/card-notification.model';
import { NotificationGateway } from '../domain/notification.gateway';

@Injectable({ providedIn: 'root' })
export class NotificationStore {
  private readonly gateway = inject(NotificationGateway);

  private readonly _notifications = signal<CardNotification[]>([]);
  private readonly _status = signal<LoadStatus>('idle');
  private readonly _filter = signal<NotificationFilter>('all');

  readonly status = this._status.asReadonly();
  readonly filter = this._filter.asReadonly();

  readonly unreadCount = computed(() => this._notifications().filter((n) => !n.read).length);

  readonly visible = computed(() => {
    const all = this._notifications();
    const items = this._filter() === 'unread' ? all.filter((n) => !n.read) : all;
    return [...items].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  });

  async load(): Promise<void> {
    this._status.set('loading');
    try {
      this._notifications.set(await this.gateway.list());
      this._status.set('success');
    } catch {
      this._notifications.set([]);
      this._status.set('error');
    }
  }

  setFilter(filter: NotificationFilter): void {
    this._filter.set(filter);
  }

  markAsRead(id: string): void {
    this._notifications.update((list) => list.map((n) => (n.id === id ? { ...n, read: true } : n)));
  }

  markAllAsRead(): void {
    this._notifications.update((list) => list.map((n) => ({ ...n, read: true })));
  }
}
