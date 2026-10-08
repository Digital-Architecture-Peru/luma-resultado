import { DatePipe } from '@angular/common';
import { Component, Input } from '@angular/core';
import { AmountComponent } from '../atoms/amount.component';
import { MaskedPanComponent } from '../atoms/masked-pan.component';
import { StatusBadgeComponent } from '../atoms/status-badge.component';
import { CardDetail } from '../data/card.model';

@Component({
  selector: 'app-card-detail-panel',
  standalone: true,
  imports: [DatePipe, AmountComponent, MaskedPanComponent, StatusBadgeComponent],
  template: `
    <section class="panel" aria-label="Detalle de la tarjeta">
      <h2>{{ card.brand }} <app-masked-pan [value]="card.maskedPan" /></h2>
      <dl>
        <dt>Estado</dt><dd><app-status-badge [status]="card.status" /></dd>
        <dt>Tipo</dt><dd>{{ card.cardType === 'CREDIT' ? 'Crédito' : 'Débito' }}</dd>
        @if (card.creditLimit !== null) {
          <dt>Límite de crédito</dt>
          <dd><app-amount [value]="card.creditLimit" [currency]="card.currency" /></dd>
        }
        <dt>Saldo disponible</dt>
        <dd><app-amount [value]="card.availableBalance" [currency]="card.currency" /></dd>
        <dt>Alta</dt><dd>{{ card.createdAt | date: 'dd/MM/yyyy' }}</dd>
      </dl>
    </section>
  `,
  styles: [
    `
      .panel {
        background: var(--surface);
        border: 1px solid var(--border);
        border-radius: var(--radius-md);
        padding: var(--space-4);
      }
      dl { display: grid; grid-template-columns: max-content 1fr; gap: var(--space-2) var(--space-6); margin: 0; }
      dt { color: var(--muted); }
      dd { margin: 0; }
    `,
  ],
})
export class CardDetailPanelComponent {
  @Input({ required: true }) card!: CardDetail;
}
