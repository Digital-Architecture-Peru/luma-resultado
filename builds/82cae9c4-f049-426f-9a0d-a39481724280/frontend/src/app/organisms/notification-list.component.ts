import { Component, EventEmitter, Input, Output } from '@angular/core';
import { PaymentNotification } from '../core/models/payment-notification.model';
import { NotificationItemComponent } from '../molecules/notification-item.component';

@Component({
  selector: 'app-notification-list',
  standalone: true,
  imports: [NotificationItemComponent],
  template: `
    @if (loading) {
      <p class="state">Cargando notificaciones…</p>
    } @else if (error) {
      <p class="state state--error" role="alert">{{ error }}</p>
    } @else if (items.length === 0) {
      <p class="state">No tienes notificaciones.</p>
    } @else {
      <ul class="list">
        @for (item of items; track item.id) {
          <li><app-notification-item [notification]="item" (markRead)="markRead.emit($event)" /></li>
        }
      </ul>
    }
  `,
})
export class NotificationListComponent {
  @Input() items: PaymentNotification[] = [];
  @Input() loading = false;
  @Input() error: string | null = null;
  @Output() markRead = new EventEmitter<string>();
}
