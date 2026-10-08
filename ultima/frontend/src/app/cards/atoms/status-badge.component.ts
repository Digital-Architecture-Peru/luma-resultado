import { Component, Input } from '@angular/core';
import { CardStatus } from '../data/card.model';

const LABELS: Record<CardStatus, string> = {
  ACTIVE: 'Activa',
  BLOCKED: 'Bloqueada',
  EXPIRED: 'Vencida',
};

@Component({
  selector: 'app-status-badge',
  standalone: true,
  template: `<span class="badge" [class]="status.toLowerCase()">{{ label }}</span>`,
  styles: [`
    .badge { display: inline-block; padding: 2px 10px; border-radius: 999px; font-size: 0.8rem;
      font-weight: 600; border: 1px solid currentColor; }
    .active { color: var(--success); }
    .blocked { color: var(--danger); }
    .expired { color: var(--warning); }
  `],
})
export class StatusBadgeComponent {
  @Input({ required: true }) status: CardStatus = 'ACTIVE';

  get label(): string {
    return LABELS[this.status];
  }
}
