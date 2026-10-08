import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Card, TYPE_LABELS } from '../data/card.model';
import { AmountComponent } from '../atoms/amount.component';
import { BadgeStatusComponent } from '../atoms/badge-status.component';
import { MaskedNumberComponent } from '../atoms/masked-number.component';

@Component({
  selector: 'app-card-detail',
  standalone: true,
  imports: [AmountComponent, BadgeStatusComponent, MaskedNumberComponent],
  template: `
    <section class="detail" aria-labelledby="detail-title">
      <h2 id="detail-title">{{ card.brand }} · {{ typeLabel }}</h2>
      <app-masked-number [value]="card.maskedNumber" [last4]="card.last4" />
      <dl>
        <dt>Titular</dt><dd>{{ card.holderName }}</dd>
        <dt>Estado</dt><dd><app-badge-status [status]="card.status" /></dd>
        @if (card.creditLimit !== null) {
          <dt>Cupo</dt><dd><app-amount [value]="card.creditLimit" [currency]="card.currency" /></dd>
        }
        <dt>Saldo disponible</dt><dd><app-amount [value]="card.availableBalance" [currency]="card.currency" /></dd>
      </dl>
      <button type="button" class="secondary" (click)="closed.emit()">Volver al listado</button>
    </section>
  `,
  styles: [
    `
      .detail { background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius-md); padding: var(--space-6); }
      dl { display: grid; grid-template-columns: max-content 1fr; gap: var(--space-2) var(--space-6); }
      dt { color: var(--muted); }
      dd { margin: 0; }
    `,
  ],
})
export class CardDetailComponent {
  @Input({ required: true }) card!: Card;
  @Output() closed = new EventEmitter<void>();

  get typeLabel(): string {
    return TYPE_LABELS[this.card.type];
  }
}
