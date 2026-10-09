import { Component, input, output } from '@angular/core';
import { DatePipe } from '@angular/common';
import { NotificationItem, TYPE_LABELS, maskCard, typeTone } from '../data/models';
import { BadgeComponent } from '../atoms/badge.component';
import { IconButtonComponent } from '../atoms/icon-button.component';

@Component({
  selector: 'app-notification-item',
  standalone: true,
  imports: [DatePipe, BadgeComponent, IconButtonComponent],
  template: `
    <article class="item" [class.item--unread]="!item().isRead">
      <div class="item__head">
        <app-badge [tone]="tone()">{{ label() }}</app-badge>
        <span class="muted">{{ card() }}</span>
        <time class="muted" [attr.datetime]="item().createdAt">{{ item().createdAt | date: 'short' }}</time>
      </div>
      <h3 class="item__title">{{ item().title }}</h3>
      <p class="item__body">{{ item().body }}</p>
      @if (!item().isRead) {
        <app-icon-button label="Marcar como leída" (pressed)="markRead.emit(item().id)">Marcar como leída</app-icon-button>
      }
    </article>
  `,
})
export class NotificationItemComponent {
  readonly item = input.required<NotificationItem>();
  readonly markRead = output<string>();

  protected tone = () => typeTone(this.item().type);
  protected label = () => TYPE_LABELS[this.item().type];
  protected card = () => maskCard(this.item().cardLast4);
}
