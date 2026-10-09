import { Component, input, output } from '@angular/core';
import { LoadState, NotificationItem } from '../data/models';
import { NotificationItemComponent } from '../molecules/notification-item.component';

@Component({
  selector: 'app-notification-list',
  standalone: true,
  imports: [NotificationItemComponent],
  template: `
    @switch (state()) {
      @case ('loading') {
        <p role="status" class="state">Cargando notificaciones…</p>
      }
      @case ('error') {
        <p role="alert" class="state state--error">No se pudieron cargar las notificaciones. Intenta de nuevo.</p>
      }
      @default {
        @if (items().length === 0) {
          <p role="status" class="state">No tienes notificaciones.</p>
        } @else {
          <ul class="list">
            @for (item of items(); track item.id) {
              <li><app-notification-item [item]="item" (markRead)="markRead.emit($event)" /></li>
            }
          </ul>
        }
      }
    }
  `,
})
export class NotificationListComponent {
  readonly items = input.required<NotificationItem[]>();
  readonly state = input.required<LoadState>();
  readonly markRead = output<string>();
}
