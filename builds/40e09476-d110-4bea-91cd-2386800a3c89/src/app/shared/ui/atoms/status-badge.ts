import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { CardStatus } from '../../../core/cards/models/card.model';

const LABELS: Record<CardStatus, string> = {
  ACTIVE: 'Activa',
  BLOCKED: 'Bloqueada',
  EXPIRED: 'Vencida',
};

@Component({
  selector: 'app-status-badge',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<span class="badge" [class]="cssClass()">{{ label() }}</span>`,
  styles: `
    .badge { display: inline-block; padding: 0.15rem 0.6rem; border-radius: 999px; font-size: 0.8rem; font-weight: 600; border: 1px solid currentColor; }
    .active { color: var(--success); }
    .blocked { color: var(--danger); }
    .expired { color: var(--muted); }
  `,
})
export class StatusBadge {
  readonly status = input.required<CardStatus>();

  protected readonly label = computed(() => LABELS[this.status()]);
  protected readonly cssClass = computed(() => `badge ${this.status().toLowerCase()}`);
}
