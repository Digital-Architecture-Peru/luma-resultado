import { DatePipe, DecimalPipe } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { TypeBadgeComponent } from '../atoms/type-badge.component';
import { AccountNotification } from '../models/notification.model';

/** Molécula: una notificación con su tipo, mensaje, monto y acción de lectura. */
@Component({
  selector: 'app-notification-item',
  standalone: true,
  imports: [TypeBadgeComponent, DatePipe, DecimalPipe],
  template: `
    <article class="item" [class.unread]="!notification.read">
      <div class="head">
        <app-type-badge [type]="notification.type" />
        @if (!notification.read) { <strong class="new">Nueva</strong> }
        <time class="date">{{ notification.createdAt | date: 'short' }}</time>
      </div>
      <p class="msg">{{ notification.message }}</p>
      @if (notification.amount !== null) {
        <p class="amount">Monto: {{ notification.amount | number: '1.2-2' }}</p>
      }
      <p class="account">Cuenta {{ notification.account }}</p>
      @if (!notification.read) {
        <button type="button" class="secondary" (click)="markRead.emit(notification.id)">
          Marcar como leída
        </button>
      }
    </article>
  `,
  styles: [`
    .item { background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius-md);
      padding: var(--space-4); box-shadow: var(--shadow-sm); }
    .item.unread { border-inline-start: 4px solid var(--primary); }
    .head { display: flex; gap: var(--space-2); align-items: center; flex-wrap: wrap; }
    .date, .account { color: var(--muted); font-size: 0.85rem; margin-inline-start: auto; }
    .account { margin: 0; }
    .msg { margin: var(--space-2) 0; }
    .amount { margin: 0 0 var(--space-2); font-variant-numeric: tabular-nums; }
  `],
})
export class NotificationItemComponent {
  @Input({ required: true }) notification!: AccountNotification;
  @Output() markRead = new EventEmitter<string>();
}
