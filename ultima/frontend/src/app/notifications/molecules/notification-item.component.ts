import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';
import { DatePipe } from '@angular/common';
import { BadgeComponent } from '../atoms/badge.component';
import { ButtonComponent } from '../atoms/button.component';
import { TYPE_LABELS, TypeIconComponent } from '../atoms/type-icon.component';
import { CardNotification } from '../data/notification.model';

@Component({
  selector: 'app-notification-item',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [BadgeComponent, ButtonComponent, TypeIconComponent, DatePipe],
  template: `
    <article class="item" [class.unread]="notification().status === 'UNREAD'">
      <app-type-icon [type]="notification().type" />
      <div class="body">
        <h3>{{ notification().title }}</h3>
        <p>{{ notification().message }}</p>
        <small>
          Tarjeta ****{{ notification().last4 }} · {{ notification().createdAt | date: 'short' }}
        </small>
      </div>
      <div class="actions">
        <app-badge [tone]="notification().status === 'UNREAD' ? 'info' : 'success'">
          {{ notification().status === 'UNREAD' ? 'Nueva' : 'Leída' }}
        </app-badge>
        <app-badge tone="warn">{{ typeLabel() }}</app-badge>
        @if (notification().status === 'UNREAD') {
          <app-button (pressed)="markRead.emit(notification().id)">Marcar como leída</app-button>
        }
      </div>
    </article>
  `,
  styles: `
    .item { display: flex; gap: var(--space-4); align-items: flex-start; padding: var(--space-4);
      background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius-md);
      box-shadow: var(--shadow-sm); }
    .unread { border-inline-start: 4px solid var(--primary); }
    .body { flex: 1; }
    h3 { margin: 0; font-size: 1rem; }
    p { margin: var(--space-1) 0; }
    small { color: var(--muted); }
    .actions { display: flex; flex-direction: column; gap: var(--space-2); align-items: flex-end; }
  `,
})
export class NotificationItemComponent {
  readonly notification = input.required<CardNotification>();
  readonly markRead = output<string>();
  protected readonly typeLabel = computed(() => TYPE_LABELS[this.notification().type]);
}
