import { CurrencyPipe, DatePipe } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { EVENT_LABELS, PaymentNotification } from '../../core/models';
import { StatusBadgeComponent } from '../atoms/status-badge.component';

/** Molécula: una notificación. Emite eventos; no llama a servicios. */
@Component({
  selector: 'app-notification-item',
  standalone: true,
  imports: [CurrencyPipe, DatePipe, StatusBadgeComponent],
  template: `
    <article class="item" [class.item--unread]="notification.status === 'UNREAD'">
      <div class="item__main">
        <h3>{{ eventLabel }}</h3>
        <p>{{ notification.amount | currency: notification.currency }} · Cuenta {{ notification.maskedAccount }}</p>
        <time [attr.datetime]="notification.createdAt">{{ notification.createdAt | date: 'medium' }}</time>
      </div>
      <div class="item__side">
        <app-status-badge [status]="notification.status" />
        @if (notification.status === 'UNREAD') {
          <button type="button" (click)="markRead.emit(notification.id)">Marcar como leída</button>
        }
      </div>
    </article>
  `,
  styles: [
    `
      .item {
        display: flex;
        justify-content: space-between;
        gap: var(--space-4);
        padding: var(--space-4);
        border: 1px solid var(--border);
        border-radius: var(--radius-lg);
        background: var(--surface);
        box-shadow: var(--shadow-sm);
      }
      .item--unread {
        border-inline-start: 4px solid var(--primary);
      }
      h3,
      p {
        margin: 0;
      }
      time {
        color: var(--muted);
        font-size: 0.85rem;
      }
      .item__side {
        display: flex;
        flex-direction: column;
        align-items: flex-end;
        gap: var(--space-2);
      }
    `,
  ],
})
export class NotificationItemComponent {
  @Input({ required: true }) notification!: PaymentNotification;
  @Output() markRead = new EventEmitter<string>();

  get eventLabel(): string {
    return EVENT_LABELS[this.notification.eventType];
  }
}
