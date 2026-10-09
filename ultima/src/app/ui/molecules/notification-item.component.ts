import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';
import { ActionButtonComponent } from '../atoms/action-button.component';
import { StatusBadgeComponent } from '../atoms/status-badge.component';
import { PaymentNotification, labelOf, severityOf } from '../../domain/notification.model';

/** Molécula: una notificación con su estado y la acción de marcarla como leída. */
@Component({
  selector: 'app-notification-item',
  standalone: true,
  imports: [StatusBadgeComponent, ActionButtonComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <article class="item" [class.item--unread]="!notification().read">
      <header class="item__head">
        <app-status-badge [label]="kindLabel()" [severity]="severity()" />
        <time class="item__time" [attr.datetime]="notification().createdAt">{{ dateText() }}</time>
      </header>
      <h3 class="item__title">{{ notification().title }}</h3>
      <p class="item__message">{{ notification().message }}</p>
      <p class="item__amount">{{ amountText() }}</p>
      @if (!notification().read) {
        <app-action-button label="Marcar como leída" (activated)="markRead.emit(notification().id)" />
      } @else {
        <span class="item__read">Leída</span>
      }
    </article>
  `
})
export class NotificationItemComponent {
  readonly notification = input.required<PaymentNotification>();
  readonly markRead = output<string>();

  readonly kindLabel = computed(() => labelOf(this.notification().kind));
  readonly severity = computed(() => severityOf(this.notification().kind));
  readonly amountText = computed(() => {
    const { amountCents, currency } = this.notification();
    return new Intl.NumberFormat('es-PE', { style: 'currency', currency }).format(amountCents / 100);
  });
  readonly dateText = computed(() =>
    new Date(this.notification().createdAt).toLocaleDateString('es-PE')
  );
}
