import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { CardNotification } from '../data/notification.model';
import { NotificationItemComponent } from '../molecules/notification-item.component';

@Component({
  selector: 'app-notification-list',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NotificationItemComponent],
  template: `
    @if (loading()) {
      <p role="status">Cargando notificaciones…</p>
    } @else if (error()) {
      <p role="alert">{{ error() }}</p>
    } @else if (items().length === 0) {
      <p role="status">No tienes notificaciones para esta tarjeta.</p>
    } @else {
      <ul class="list">
        @for (item of items(); track item.id) {
          <li><app-notification-item [notification]="item" (markRead)="markRead.emit($event)" /></li>
        }
      </ul>
    }
  `,
  styles: `
    .list { list-style: none; margin: 0; padding: 0; display: grid; gap: var(--space-3); }
  `,
})
export class NotificationListComponent {
  readonly items = input<readonly CardNotification[]>([]);
  readonly loading = input(false);
  readonly error = input<string | null>(null);
  readonly markRead = output<string>();
}
