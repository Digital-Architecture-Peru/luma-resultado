import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { CardNotification } from '../../domain/card-notification.model';
import { NotificationItemComponent } from '../molecules/notification-item.component';

@Component({
  selector: 'app-notification-list',
  standalone: true,
  imports: [NotificationItemComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (items().length === 0) {
      <p class="empty" role="status">No tienes notificaciones para mostrar.</p>
    } @else {
      <ul class="list">
        @for (item of items(); track item.id) {
          <li>
            <app-notification-item [notification]="item" (markRead)="markRead.emit($event)" />
          </li>
        }
      </ul>
    }
  `,
})
export class NotificationListComponent {
  readonly items = input.required<readonly CardNotification[]>();
  readonly markRead = output<string>();
}
