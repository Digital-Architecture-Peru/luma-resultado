import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Card, TYPE_LABELS } from '../data/card.model';
import { AmountComponent } from '../atoms/amount.component';
import { BadgeStatusComponent } from '../atoms/badge-status.component';
import { MaskedNumberComponent } from '../atoms/masked-number.component';

@Component({
  selector: 'app-card-summary',
  standalone: true,
  imports: [AmountComponent, BadgeStatusComponent, MaskedNumberComponent],
  template: `
    <article class="card">
      <header>
        <strong>{{ card.brand }} · {{ typeLabel }}</strong>
        <app-badge-status [status]="card.status" />
      </header>
      <app-masked-number [value]="card.maskedNumber" [last4]="card.last4" />
      <p class="muted">Disponible: <app-amount [value]="card.availableBalance" [currency]="card.currency" /></p>
      <button type="button" class="secondary" (click)="selected.emit(card.id)">
        Ver detalle<span class="sr"> de la tarjeta terminada en {{ card.last4 }}</span>
      </button>
    </article>
  `,
  styles: [
    `
      .card { background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius-md); box-shadow: var(--shadow-sm); padding: var(--space-4); display: grid; gap: var(--space-2); }
      header { display: flex; justify-content: space-between; align-items: center; gap: var(--space-2); }
      .muted { color: var(--muted); margin: 0; }
      .sr { position: absolute; inline-size: 1px; block-size: 1px; overflow: hidden; clip-path: inset(50%); }
    `,
  ],
})
export class CardSummaryComponent {
  @Input({ required: true }) card!: Card;
  @Output() selected = new EventEmitter<string>();

  get typeLabel(): string {
    return TYPE_LABELS[this.card.type];
  }
}
