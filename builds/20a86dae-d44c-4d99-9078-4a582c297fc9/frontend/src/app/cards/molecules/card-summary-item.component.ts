import { Component, EventEmitter, Input, Output } from '@angular/core';
import { AmountComponent } from '../atoms/amount.component';
import { MaskedPanComponent } from '../atoms/masked-pan.component';
import { StatusBadgeComponent } from '../atoms/status-badge.component';
import { CardSummary } from '../data/card.model';

@Component({
  selector: 'app-card-summary-item',
  standalone: true,
  imports: [AmountComponent, MaskedPanComponent, StatusBadgeComponent],
  template: `
    <button type="button" class="item" [class.selected]="selected" [attr.aria-pressed]="selected"
            (click)="chosen.emit(card.id)">
      <span class="type">{{ card.type === 'CREDIT' ? 'Crédito' : 'Débito' }}</span>
      <app-masked-pan [pan]="card.maskedPan" />
      <app-status-badge [status]="card.status" />
      <span class="balance">Disponible <app-amount [value]="card.availableBalance" [currency]="card.currency" /></span>
    </button>
  `,
  styles: [`
    .item { display: grid; gap: 4px; width: 100%; text-align: start; min-height: 44px; padding: 12px 16px;
      background: var(--surface); color: var(--text); border: 1px solid var(--border);
      border-radius: var(--radius-md); box-shadow: var(--shadow-sm); cursor: pointer; font: inherit; }
    .item.selected { border-color: var(--primary); border-width: 2px; }
    .type { color: var(--muted); font-size: 0.85rem; }
  `],
})
export class CardSummaryItemComponent {
  @Input({ required: true }) card!: CardSummary;
  @Input() selected = false;
  @Output() chosen = new EventEmitter<string>();
}
