import { Injectable, computed, inject, signal } from '@angular/core';
import {
  AccountNotification,
  LoadState,
  NotificationFilter,
} from '../domain/notification.model';
import { NotificationRepository } from '../domain/notification.repository';

/** Estado de la pantalla de notificaciones (en memoria; sin persistencia). */
@Injectable({ providedIn: 'root' })
export class NotificationStore {
  private readonly repository = inject(NotificationRepository);

  private readonly items = signal<AccountNotification[]>([]);
  readonly state = signal<LoadState>('idle');
  readonly filter = signal<NotificationFilter>('all');

  readonly unreadCount = computed(() => this.items().filter((n) => !n.read).length);
  readonly visible = computed(() =>
    this.filter() === 'unread' ? this.items().filter((n) => !n.read) : this.items(),
  );

  load(): void {
    this.state.set('loading');
    this.repository.list().subscribe({
      next: (list) => {
        this.items.set(list);
        this.state.set('success');
      },
      error: () => this.state.set('error'),
    });
  }

  setFilter(filter: NotificationFilter): void {
    this.filter.set(filter);
  }

  markRead(id: string): void {
    this.items.update((list) => list.map((n) => (n.id === id ? { ...n, read: true } : n)));
  }

  markAllRead(): void {
    this.items.update((list) => list.map((n) => ({ ...n, read: true })));
  }

  dismiss(id: string): void {
    this.items.update((list) => list.filter((n) => n.id !== id));
  }
}
