import { Component, EventEmitter, Input, Output } from '@angular/core';
import { AccountNotification } from '../data/models';
import { NotificationItemComponent } from '../molecules/notification-item.component';

@Component({
  selector: 'app-notification-list',
  standalone: true,
  imports: [NotificationItemComponent],
  template: `
    @if (items.length === 0) {
      <p class="empty">No hay notificaciones.</p>
    } @else {
      <ul>
        @for (n of items; track n.id) {
          <li><app-notification-item [notification]="n" (markRead)="markRead.emit($event)" /></li>
        }
      </ul>
    }
  `,
  styles: [`ul { list-style: none; margin: 0; padding: 0; display: grid; gap: var(--space-3); } .empty { color: var(--muted); }`]
})
export class NotificationListComponent {
  @Input() items: AccountNotification[] = [];
  @Output() markRead = new EventEmitter<string>();
}
