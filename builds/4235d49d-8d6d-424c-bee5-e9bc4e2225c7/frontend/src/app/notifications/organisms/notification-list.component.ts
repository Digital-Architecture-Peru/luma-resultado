import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NotificationItemComponent } from '../molecules/notification-item.component';
import { AccountNotification } from '../models/notification.model';

/** Organismo: lista de notificaciones con estado vacío. */
@Component({
  selector: 'app-notification-list',
  standalone: true,
  imports: [NotificationItemComponent],
  template: `
    @if (items.length === 0) {
      <p class="empty">No tienes notificaciones.</p>
    } @else {
      <ul class="list">
        @for (n of items; track n.id) {
          <li><app-notification-item [notification]="n" (markRead)="markRead.emit($event)" /></li>
        }
      </ul>
    }
  `,
  styles: [`
    .list { list-style: none; margin: 0; padding: 0; display: grid; gap: var(--space-3); }
    .empty { color: var(--muted); text-align: center; padding: var(--space-6); }
  `],
})
export class NotificationListComponent {
  @Input() items: AccountNotification[] = [];
  @Output() markRead = new EventEmitter<string>();
}
