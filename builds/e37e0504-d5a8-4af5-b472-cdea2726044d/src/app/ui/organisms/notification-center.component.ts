import { ChangeDetectionStrategy, Component, OnInit, computed, inject } from '@angular/core';
import { NotificationStore } from '../../application/notification-store.service';
import { ActionButtonComponent } from '../atoms/action-button.component';
import { NotificationItemComponent } from '../molecules/notification-item.component';

/** Organismo: centro de notificaciones de pagos (carga, filtros, lista y estados). */
@Component({
  selector: 'app-notification-center',
  standalone: true,
  imports: [NotificationItemComponent, ActionButtonComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="center" aria-labelledby="center-title">
      <header class="center__head">
        <h2 id="center-title">Notificaciones de pagos</h2>
        <p role="status" class="center__summary">{{ summary() }}</p>
      </header>

      <div class="center__actions">
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
          (activated)="store.markAllRead()"
        />
      </div>

      @switch (store.status()) {
        @case ('loading') {
          <p class="state">Cargando notificaciones…</p>
        }
        @case ('error') {
          <p class="state state--error" role="alert">No se pudieron cargar las notificaciones.</p>
          <app-action-button label="Reintentar" (activated)="store.load()" />
        }
        @default {
          @if (store.visibleItems().length === 0 && store.status() === 'success') {
            <p class="state">No tienes notificaciones para mostrar.</p>
          }
          <ul class="list">
            @for (n of store.visibleItems(); track n.id) {
              <li><app-notification-item [notification]="n" (markRead)="store.markRead($event)" /></li>
            }
          </ul>
        }
      }
    </section>
  `
})
export class NotificationCenterComponent implements OnInit {
  protected readonly store = inject(NotificationStore);

  protected readonly summary = computed(() => {
    const unread = this.store.unreadCount();
    return unread === 0
      ? 'No tienes notificaciones sin leer.'
      : `Tienes ${unread} notificación(es) sin leer.`;
  });

  ngOnInit(): void {
    this.store.load();
  }
}
