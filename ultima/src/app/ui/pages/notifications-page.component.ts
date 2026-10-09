import { ChangeDetectionStrategy, Component, OnInit, computed, inject } from '@angular/core';
import { NotificationStore } from '../../application/notification-store.service';
import { ActionButtonComponent } from '../atoms/action-button.component';
import { NotificationListComponent } from '../organisms/notification-list.component';

@Component({
  selector: 'app-notifications-page',
  standalone: true,
  imports: [ActionButtonComponent, NotificationListComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="page" aria-labelledby="notif-title">
      <h2 id="notif-title">Notificaciones de tarjetas</h2>
      <p class="summary" role="status">{{ summary() }}</p>

      <div class="toolbar" role="group" aria-label="Filtros">
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
          [primary]="true"
          [disabled]="store.unreadCount() === 0"
          (activated)="store.markAllAsRead()"
        />
      </div>

      @switch (store.status()) {
        @case ('loading') {
          <p class="loading" role="status">Cargando notificaciones…</p>
        }
        @case ('error') {
          <div class="error" role="alert">
            <p>No pudimos cargar tus notificaciones.</p>
            <app-action-button label="Reintentar" (activated)="reload()" />
          </div>
        }
        @case ('success') {
          <app-notification-list [items]="store.visible()" (markRead)="store.markAsRead($event)" />
        }
      }
    </section>
  `,
})
export class NotificationsPageComponent implements OnInit {
  protected readonly store = inject(NotificationStore);

  protected readonly summary = computed(() => {
    const n = this.store.unreadCount();
    if (this.store.status() !== 'success') return '';
    return n === 0 ? 'No tienes notificaciones sin leer.' : `Tienes ${n} notificaciones sin leer.`;
  });

  ngOnInit(): void {
    void this.store.load();
  }

  protected reload(): void {
    void this.store.load();
  }
}
