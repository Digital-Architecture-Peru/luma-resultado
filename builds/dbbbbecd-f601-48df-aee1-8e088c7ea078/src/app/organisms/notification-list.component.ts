import { Component, EventEmitter, Input, Output } from '@angular/core';
import { AccountNotification } from '../domain/notification.model';
import { NotificationItemComponent } from '../molecules/notification-item.component';

@Component({
  selector: 'app-notification-list',
  standalone: true,
  imports: [NotificationItemComponent],
  template: `
    @if (notifications.length === 0) {
      <p class="empty">No hay notificaciones para mostrar.</p>
    } @else {
      <ul class="list">
        @for (n of notifications; track n.id) {
          <li>
            <app-notification-item
              [notification]="n"
              (markRead)="markRead.emit($event)"
              (dismiss)="dismiss.emit($event)"
            />
          </li>
        }
      </ul>
    }
  `,
})
export class NotificationListComponent {
  @Input() notifications: readonly AccountNotification[] = [];
  @Output() readonly markRead = new EventEmitter<string>();
  @Output() readonly dismiss = new EventEmitter<string>();
}
