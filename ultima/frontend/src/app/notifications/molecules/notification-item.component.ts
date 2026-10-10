import { Component, EventEmitter, Input, Output } from '@angular/core';
import { DatePipe } from '@angular/common';
import { AccountNotification } from '../data/models';
import { IconTypeComponent } from '../atoms/icon-type.component';

@Component({
  selector: 'app-notification-item',
  standalone: true,
  imports: [DatePipe, IconTypeComponent],
  template: `
    <article class="item" [class.unread]="!notification.read">
      <app-icon-type [type]="notification.type" />
      <h3>{{ notification.title }}</h3>
      <p>{{ notification.message }}</p>
      <time>{{ notification.createdAt | date: 'medium' }}</time>
      @if (!notification.read) {
        <button type="button" class="secondary" (click)="markRead.emit(notification.id)">Marcar como leída</button>
      }
    </article>
  `,
  styles: [
    `.item { padding: var(--space-3) var(--space-4); border: 1px solid var(--border); border-radius: var(--radius-md);
      background: var(--surface); box-shadow: var(--shadow-sm); }
     .unread { border-inline-start: 4px solid var(--primary); }
     h3 { margin: 0; font-size: 1rem; } p { margin: var(--space-2) 0; } time { color: var(--muted); font-size: 0.85rem; display: block; }`
  ]
})
export class NotificationItemComponent {
  @Input({ required: true }) notification!: AccountNotification;
  @Output() markRead = new EventEmitter<string>();
}
