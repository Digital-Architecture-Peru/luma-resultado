import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { CardStatus, STATUS_LABELS } from '../domain/card.model';

/** Átomo: estado de la tarjeta con texto (no solo color). */
@Component({
  selector: 'app-status-badge',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<span class="badge" [class]="cssClass()">{{ label() }}</span>`,
  styles: [
    `
      .badge { display: inline-block; padding: 0.125rem 0.625rem; border-radius: 999px; font-size: 0.8125rem; font-weight: 600; }
      .active { background: var(--success-bg); color: var(--success); }
      .blocked { background: var(--danger-bg); color: var(--danger); }
      .expired { background: var(--warning-bg); color: var(--warning); }
    `,
  ],
})
export class StatusBadgeComponent {
  readonly status = input.required<CardStatus>();
  protected readonly label = computed(() => STATUS_LABELS[this.status()]);
  protected readonly cssClass = computed(() => `badge ${this.status().toLowerCase()}`);
}
