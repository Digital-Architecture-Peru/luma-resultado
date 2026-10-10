import { Component, computed, input, output } from '@angular/core';
import { AccountNotification } from '../../../core/models';
import { formatAmount, formatDate, typeLabel } from '../../../core/notification-format';
import { BadgeComponent } from '../../atoms/badge/badge.component';
import { IconComponent } from '../../atoms/icon/icon.component';

/** Molécula: una notificación con icono, texto, importe y acción de lectura. */
@Component({
  selector: 'app-notification-item',
  imports: [BadgeComponent, IconComponent],
  template: `
    <li class="item" [class.unread]="!notification().readAt">
      <app-icon [type]="notification().type" />
      <div class="item-body">
        <h3>{{ notification().title }}</h3>
        <p>{{ notification().body }}</p>
        <small>
          <time [attr.datetime]="notification().createdAt">{{ date() }}</time>
          · <app-badge [label]="kind()" tone="info" />
        </small>
      </div>
      <div class="item-side">
        @if (amount(); as text) {
          <span class="amount">{{ text }}</span>
        }
        @if (notification().readAt) {
          <app-badge label="Leída" tone="success" />
        } @else {
          <button type="button" class="btn" (click)="markRead.emit(notification().id)">
            Marcar como leída
          </button>
        }
      </div>
    </li>
  `,
})
export class NotificationItemComponent {
  readonly notification = input.required<AccountNotification>();
  readonly markRead = output<string>();

  protected readonly kind = computed(() => typeLabel(this.notification().type));
  protected readonly date = computed(() => formatDate(this.notification().createdAt));
  protected readonly amount = computed(() =>
    formatAmount(this.notification().amount, this.notification().currency),
  );
}
