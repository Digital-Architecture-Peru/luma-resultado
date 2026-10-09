import { Component, OnInit, inject } from '@angular/core';
import { NotificationStore } from '../application/notification.store';
import { ActionButtonComponent } from '../atoms/action-button.component';
import { NotificationListComponent } from '../organisms/notification-list.component';

@Component({
  selector: 'app-notifications-page',
  standalone: true,
  imports: [ActionButtonComponent, NotificationListComponent],
  template: `
    <section class="page" aria-labelledby="page-title">
      <h2 id="page-title">Notificaciones de cuentas</h2>
      <p role="status" class="page__status">{{ statusText() }}</p>

      <div class="toolbar">
        <app-action-button
          label="Todas"
          [pressed]="store.filter() === 'all'"
          (activated)="store.setFilter('all')"
        />
        <app-action-button
          label="No leídas"
          [pressed]="store.filter() === 'unread'"
          (activated)="store.setFilter('unread')"
        />
        <app-action-button
          label="Marcar todas como leídas"
          variant="primary"
          [disabled]="store.unreadCount() === 0"
          (activated)="store.markAllRead()"
        />
      </div>

      @switch (store.state()) {
        @case ('loading') {
          <p class="empty">Cargando notificaciones…</p>
        }
        @case ('error') {
          <div class="error" role="alert">
            <p>No se pudieron cargar las notificaciones.</p>
            <app-action-button label="Reintentar" (activated)="store.load()" />
          </div>
        }
        @case ('success') {
          <app-notification-list
            [notifications]="store.visible()"
            (markRead)="store.markRead($event)"
            (dismiss)="store.dismiss($event)"
          />
        }
      }
    </section>
  `,
})
export class NotificationsPageComponent implements OnInit {
  protected readonly store = inject(NotificationStore);

  ngOnInit(): void {
    this.store.load();
  }

  protected statusText(): string {
    const count = this.store.unreadCount();
    if (this.store.state() !== 'success') {
      return '';
    }
    return count === 0
      ? 'No tienes notificaciones sin leer.'
      : `Tienes ${count} notificaciones sin leer.`;
  }
}
