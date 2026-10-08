import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AmountComponent } from '../atoms/amount.component';
import { MaskedPanComponent } from '../atoms/masked-pan.component';
import { StatusBadgeComponent } from '../atoms/status-badge.component';
import { CardSummary } from '../data/card.model';

@Component({
  selector: 'app-card-summary-item',
  standalone: true,
  imports: [RouterLink, AmountComponent, MaskedPanComponent, StatusBadgeComponent],
  template: `
    <a class="item" [routerLink]="['/cards', card.id]">
      <div class="main">
        <strong>{{ card.brand }} · {{ card.cardType === 'CREDIT' ? 'Crédito' : 'Débito' }}</strong>
        <app-masked-pan [value]="card.maskedPan" />
      </div>
      <div class="side">
        <app-status-badge [status]="card.status" />
        <span class="muted">Disponible: <app-amount [value]="card.availableBalance" [currency]="card.currency" /></span>
      </div>
    </a>
  `,
  styles: [
    `
      .item {
        display: flex;
        flex-wrap: wrap;
        justify-content: space-between;
        gap: var(--space-3);
        padding: var(--space-4);
        background: var(--surface);
        border: 1px solid var(--border);
        border-radius: var(--radius-md);
        box-shadow: var(--shadow-sm);
        color: var(--text);
        text-decoration: none;
      }
      .main, .side { display: flex; flex-direction: column; gap: var(--space-1); }
      .muted { color: var(--muted); }
    `,
  ],
})
export class CardSummaryItemComponent {
  @Input({ required: true }) card!: CardSummary;
}
