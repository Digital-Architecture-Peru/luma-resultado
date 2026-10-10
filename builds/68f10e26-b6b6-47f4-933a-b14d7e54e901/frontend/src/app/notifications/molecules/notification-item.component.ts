import { DatePipe, DecimalPipe } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ButtonComponent } from '../atoms/button.component';
import { NotificationIconComponent } from '../atoms/notification-icon.component';
import { StatusBadgeComponent } from '../atoms/status-badge.component';
import { AppNotification } from '../data/models';

@Component({
  selector: 'app-notification-item',
  standalone: true,
  imports: [ButtonComponent, NotificationIconComponent, StatusBadgeComponent, DecimalPipe, DatePipe],
  template: `
    <article class="item" [class.item--unread]="notification.status === 'UNREAD'">
      <app-notification-icon [type]="notification.type" />
      <div class="body">
        <h3>{{ notification.title }} <app-status-badge [status]="notification.status" /></h3>
        <p>{{ notification.message }}</p>
        <small>
          {{ notification.amount | number: '1.2-2' }} {{ notification.currency }} ·
          {{ notification.maskedAccount }} · {{ notification.createdAt | date: 'short' }}
        </small>
      </div>
      @if (notification.status === 'UNREAD') {
        <app-button label="Marcar como leída" (pressed)="markRead.emit(notification.id)" />
      }
    </article>
  `,
  styles: [
    `.item{display:flex;gap:var(--space);align-items:flex-start;padding:var(--space);border:1px solid var(--border);
      border-radius:var(--radius);background:var(--surface)}
     .item--unread{border-inline-start:4px solid var(--primary)}
     .body{flex:1;min-inline-size:0} h3{margin:0 0 .25rem;font-size:1rem} p{margin:0 0 .25rem}
     small{color:var(--muted)}
     @media (max-width:480px){.item{flex-wrap:wrap}}`,
  ],
})
export class NotificationItemComponent {
  @Input({ required: true }) notification!: AppNotification;
  @Output() markRead = new EventEmitter<string>();
}
