import { Component, EventEmitter, Input, Output } from '@angular/core';
import { PaymentNotification } from '../../core/models';
import { NotificationItemComponent } from '../molecules/notification-item.component';

/** Organismo: lista con estados de carga, error y vacío. */
@Component({
  selector: 'app-notification-list',
  standalone: true,
  imports: [NotificationItemComponent],
  template: `
    @if (error) {
      <p class="state state--error" role="alert">{{ error }}</p>
    } @else if (loading) {
      <p class="state" role="status">Cargando notificaciones…</p>
    } @else if (items.length === 0) {
      <p class="state" role="status">No tienes notificaciones de pagos.</p>
    } @else {
      <ul class="list">
        @for (n of items; track n.id) {
          <li><app-notification-item [notification]="n" (markRead)="markRead.emit($event)" /></li>
        }
      </ul>
    }
  `,
  styles: [
    `
      .list {
        display: grid;
        gap: var(--space-3);
        margin: 0;
        padding: 0;
        list-style: none;
      }
      .state {
        padding: var(--space-4);
        color: var(--muted);
      }
      .state--error {
        color: var(--danger);
        font-weight: 600;
      }
    `,
  ],
})
export class NotificationListComponent {
  @Input() items: PaymentNotification[] = [];
  @Input() loading = false;
  @Input() error: string | null = null;
  @Output() markRead = new EventEmitter<string>();
}
