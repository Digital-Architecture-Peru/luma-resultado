import { DatePipe } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { AmountTextComponent } from '../atoms/amount-text.component';
import { BadgeComponent, BadgeTone } from '../atoms/badge.component';
import { IconComponent } from '../atoms/icon.component';
import { PaymentNotification } from '../core/models/payment-notification.model';

@Component({
  selector: 'app-notification-item',
  standalone: true,
  imports: [DatePipe, AmountTextComponent, BadgeComponent, IconComponent],
  template: `
    <article class="item" [class.item--unread]="isUnread">
      <app-icon [type]="notification.type" />
      <div class="item__body">
        <h3>{{ notification.title }}</h3>
        <p>{{ notification.message }}</p>
        <small>{{ notification.createdAt | date: 'short' }}</small>
      </div>
      <div class="item__side">
        <app-amount-text [amount]="notification.amount" [currency]="notification.currency" />
        <app-badge [label]="statusLabel" [tone]="tone" />
        @if (isUnread) {
          <button type="button" class="btn" (click)="markRead.emit(notification.id)">
            Marcar como leída
          </button>
        }
      </div>
    </article>
  `,
})
export class NotificationItemComponent {
  @Input({ required: true }) notification!: PaymentNotification;
  @Output() markRead = new EventEmitter<string>();

  get isUnread(): boolean {
    return this.notification.status === 'UNREAD';
  }

  get statusLabel(): string {
    return this.isUnread ? 'Sin leer' : 'Leída';
  }

  get tone(): BadgeTone {
    if (!this.isUnread) {
      return 'neutral';
    }
    return this.notification.type === 'PAGO_RECHAZADO' ? 'danger' : 'info';
  }
}
