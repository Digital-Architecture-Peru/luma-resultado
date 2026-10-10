import { Component, Input } from '@angular/core';
import { NotificationStatus } from '../data/models';

@Component({
  selector: 'app-status-badge',
  standalone: true,
  template: `<span class="badge" [class.badge--unread]="status === 'UNREAD'">{{ label }}</span>`,
  styles: [
    `.badge{display:inline-block;padding:.125rem .5rem;border-radius:999px;font-size:.75rem;font-weight:600;
      background:var(--surface-alt);color:var(--muted);border:1px solid var(--border)}
     .badge--unread{background:var(--primary);color:var(--primary-contrast);border-color:var(--primary)}`,
  ],
})
export class StatusBadgeComponent {
  @Input({ required: true }) status!: NotificationStatus;

  get label(): string {
    return this.status === 'UNREAD' ? 'Nueva' : 'Leída';
  }
}
