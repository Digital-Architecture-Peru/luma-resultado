import { Component, Input } from '@angular/core';
import { NotificationType } from '../data/models';

const GLYPHS: Record<NotificationType, string> = {
  PAYMENT_COMPLETED: '✔',
  PAYMENT_REJECTED: '✖',
  PAYMENT_SCHEDULED: '⏰',
};

@Component({
  selector: 'app-notification-icon',
  standalone: true,
  template: `<span class="icon" aria-hidden="true">{{ glyph }}</span>`,
  styles: [
    `.icon{display:inline-flex;align-items:center;justify-content:center;inline-size:2rem;block-size:2rem;
      border-radius:50%;background:var(--surface-alt);border:1px solid var(--border)}`,
  ],
})
export class NotificationIconComponent {
  @Input({ required: true }) type!: NotificationType;

  get glyph(): string {
    return GLYPHS[this.type];
  }
}
