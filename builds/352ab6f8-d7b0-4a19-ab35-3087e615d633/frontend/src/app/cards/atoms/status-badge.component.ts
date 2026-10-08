import { Component, Input } from '@angular/core';
import { CardStatus } from '../data/card.model';

const LABELS: Record<CardStatus, string> = {
  ACTIVE: 'Activa',
  BLOCKED: 'Bloqueada',
  CANCELLED: 'Cancelada',
};

@Component({
  selector: 'app-status-badge',
  standalone: true,
  template: `<span class="badge" [class]="'badge ' + status.toLowerCase()">{{ label }}</span>`,
  styles: [
    `
      .badge {
        display: inline-block;
        padding: 2px var(--space-2);
        border: 1px solid currentColor;
        border-radius: 999px;
        font-size: 0.8rem;
        font-weight: 600;
      }
      .active { color: var(--success); }
      .blocked { color: var(--warning); }
      .cancelled { color: var(--danger); }
    `,
  ],
})
export class StatusBadgeComponent {
  @Input({ required: true }) status!: CardStatus;

  get label(): string {
    return LABELS[this.status];
  }
}
