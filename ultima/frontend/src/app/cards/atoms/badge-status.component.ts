import { Component, Input } from '@angular/core';
import { CardStatus, STATUS_LABELS } from '../data/card.model';

@Component({
  selector: 'app-badge-status',
  standalone: true,
  template: `<span class="badge" [class]="'badge ' + status.toLowerCase()">{{ label }}</span>`,
  styles: [
    `
      .badge { display: inline-block; padding: 2px 10px; border-radius: 999px; border: 1px solid currentColor; font-size: 0.85rem; }
      .active { color: var(--success); }
      .blocked, .cancelled { color: var(--danger); }
    `,
  ],
})
export class BadgeStatusComponent {
  @Input({ required: true }) status: CardStatus = 'ACTIVE';

  get label(): string {
    return STATUS_LABELS[this.status];
  }
}
