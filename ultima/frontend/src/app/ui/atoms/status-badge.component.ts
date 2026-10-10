import { Component, Input } from '@angular/core';
import { NotificationStatus } from '../../core/models';

/** Átomo: indicador de estado. No sabe nada de HTTP. */
@Component({
  selector: 'app-status-badge',
  standalone: true,
  template: `<span class="badge" [class.badge--unread]="status === 'UNREAD'">{{ label }}</span>`,
  styles: [
    `
      .badge {
        display: inline-block;
        padding: var(--space-1) var(--space-3);
        border: 1px solid var(--border);
        border-radius: var(--radius-lg);
        color: var(--muted);
        font-size: 0.8rem;
      }
      .badge--unread {
        border-color: var(--primary);
        color: var(--primary);
        font-weight: 600;
      }
    `,
  ],
})
export class StatusBadgeComponent {
  @Input({ required: true }) status!: NotificationStatus;

  get label(): string {
    return this.status === 'UNREAD' ? 'Nueva' : 'Leída';
  }
}
