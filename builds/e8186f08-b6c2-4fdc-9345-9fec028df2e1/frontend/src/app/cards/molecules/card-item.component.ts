import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CardSummary } from '../data/card.model';
import { MaskedPanComponent } from '../atoms/masked-pan.component';
import { StatusBadgeComponent } from '../atoms/status-badge.component';

/** Molécula: fila de tarjeta con alias, PAN enmascarado y estado. */
@Component({
  selector: 'app-card-item',
  standalone: true,
  imports: [RouterLink, MaskedPanComponent, StatusBadgeComponent],
  template: `
    <a class="item" [routerLink]="['/tarjetas', card.id]">
      <span class="alias">{{ card.alias }}</span>
      <span class="meta">{{ card.brand }} · {{ card.type === 'CREDIT' ? 'Crédito' : 'Débito' }}</span>
      <app-masked-pan [value]="card.maskedPan" />
      <app-status-badge [status]="card.status" />
    </a>
  `,
  styles: [`
    .item { display: grid; gap: 0.25rem; padding: var(--space-4); background: var(--surface);
            border: 1px solid var(--border); border-radius: var(--radius); color: var(--text);
            text-decoration: none; }
    .item:hover { border-color: var(--primary); }
    .alias { font-weight: 700; }
    .meta { color: var(--muted); font-size: 0.9rem; }
  `],
})
export class CardItemComponent {
  @Input({ required: true }) card!: CardSummary;
}
