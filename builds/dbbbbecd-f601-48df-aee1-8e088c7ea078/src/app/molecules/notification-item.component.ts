import { DatePipe } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ActionButtonComponent } from '../atoms/action-button.component';
import { BadgeComponent } from '../atoms/badge.component';
import {
  AccountNotification,
  BadgeTone,
  KIND_LABELS,
  KIND_TONES,
} from '../domain/notification.model';

@Component({
  selector: 'app-notification-item',
  standalone: true,
  imports: [DatePipe, BadgeComponent, ActionButtonComponent],
  template: `
    <article class="item" [class.item--unread]="!notification.read">
      <header class="item__head">
        <app-badge [label]="kindLabel" [tone]="tone" />
        <span class="item__account">{{ notification.accountAlias }}</span>
        <time class="item__date" [attr.datetime]="notification.createdAt">
          {{ notification.createdAt | date: 'dd/MM/yyyy HH:mm' }}
        </time>
      </header>
      <h3 class="item__title">
        {{ notification.title }}
        @if (!notification.read) {
          <span class="item__new">(nueva)</span>
        }
      </h3>
      <p class="item__message">{{ notification.message }}</p>
      <div class="item__actions">
        @if (!notification.read) {
          <app-action-button
            label="Marcar como leída"
            variant="primary"
            (activated)="markRead.emit(notification.id)"
          />
        }
        <app-action-button
          label="Descartar"
          variant="ghost"
          (activated)="dismiss.emit(notification.id)"
        />
      </div>
    </article>
  `,
})
export class NotificationItemComponent {
  @Input({ required: true }) notification!: AccountNotification;
  @Output() readonly markRead = new EventEmitter<string>();
  @Output() readonly dismiss = new EventEmitter<string>();

  get kindLabel(): string {
    return KIND_LABELS[this.notification.kind];
  }

  get tone(): BadgeTone {
    return KIND_TONES[this.notification.kind];
  }
}
