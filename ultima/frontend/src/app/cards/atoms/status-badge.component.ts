import { Component, Input } from '@angular/core';
import { CardStatus } from '../data/card.model';

const LABELS: Record<CardStatus, string> = {
  ACTIVE: 'Activa',
  BLOCKED: 'Bloqueada',
  EXPIRED: 'Vencida',
};

/** Átomo: estado de la tarjeta; el texto acompaña al color. */
@Component({
  selector: 'app-status-badge',
  standalone: true,
  template: `<span class="badge" [class.ok]="status === 'ACTIVE'" [class.bad]="status === 'BLOCKED'">{{ label }}</span>`,
  styles: [`
    .badge { display: inline-block; padding: 0.1rem 0.6rem; border-radius: 999px; font-size: 0.8rem;
             background: var(--neutral-bg); color: var(--text); }
    .ok { background: var(--success-bg); color: var(--success); }
    .bad { background: var(--danger-bg); color: var(--danger); }
  `],
})
export class StatusBadgeComponent {
  @Input({ required: true }) status: CardStatus = 'ACTIVE';

  get label(): string {
    return LABELS[this.status];
  }
}
