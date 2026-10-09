import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';
import { CardNotification, NotificationSeverity } from '../../domain/card-notification.model';
import { ActionButtonComponent } from '../atoms/action-button.component';
import { BadgeComponent, BadgeTone } from '../atoms/badge.component';

const SEVERITY_LABEL: Record<NotificationSeverity, string> = {
  info: 'Informativa',
  warning: 'Atención',
  critical: 'Crítica',
};

@Component({
  selector: 'app-notification-item',
  standalone: true,
  imports: [DatePipe, BadgeComponent, ActionButtonComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <article class="item" [class.item--unread]="!notification().read">
      <header class="item__header">
        <app-badge [label]="severityLabel()" [tone]="tone()" />
        <span class="item__card">{{ notification().cardAlias }} ····{{ notification().cardLast4 }}</span>
      </header>
      <h3 class="item__title">{{ notification().title }}</h3>
      <p class="item__message">{{ notification().message }}</p>
      <footer class="item__footer">
        <time [attr.datetime]="notification().createdAt">
          {{ notification().createdAt | date: 'dd/MM/yyyy HH:mm' : 'UTC' }}
        </time>
        @if (notification().read) {
          <span class="item__state">Leída</span>
        } @else {
          <app-action-button
            label="Marcar como leída"
            [ariaLabel]="'Marcar como leída: ' + notification().title"
            (activated)="markRead.emit(notification().id)"
          />
        }
      </footer>
    </article>
  `,
})
export class NotificationItemComponent {
  readonly notification = input.required<CardNotification>();
  readonly markRead = output<string>();

  readonly severityLabel = computed(() => SEVERITY_LABEL[this.notification().severity]);
  readonly tone = computed<BadgeTone>(() => this.notification().severity);
}
