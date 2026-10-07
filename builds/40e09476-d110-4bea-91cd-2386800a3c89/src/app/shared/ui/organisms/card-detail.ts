import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { Card } from '../../../core/cards/models/card.model';
import { Amount } from '../atoms/amount';
import { CardNumber } from '../atoms/card-number';
import { StatusBadge } from '../atoms/status-badge';

@Component({
  selector: 'app-card-detail',
  imports: [Amount, CardNumber, StatusBadge],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="detail" aria-label="Datos de la tarjeta">
      <h2>{{ card().alias }} <app-status-badge [status]="card().status" /></h2>
      <dl>
        <dt>Número</dt><dd><app-card-number [value]="card().maskedNumber" /></dd>
        <dt>Titular</dt><dd>{{ card().holder }}</dd>
        <dt>Tipo</dt><dd>{{ card().type === 'CREDIT' ? 'Crédito' : 'Débito' }} · {{ card().brand }}</dd>
        <dt>Vencimiento</dt><dd>{{ card().expiry }}</dd>
        <dt>Saldo disponible</dt><dd><app-amount [value]="card().availableBalance" [currency]="card().currency" /></dd>
        @if (card().creditLimit !== undefined) {
          <dt>Línea de crédito</dt><dd><app-amount [value]="card().creditLimit!" [currency]="card().currency" /></dd>
        }
      </dl>
    </section>
  `,
  styles: `
    .detail { border: 1px solid var(--border); border-radius: 0.75rem; padding: 1rem; background: var(--surface); }
    dl { display: grid; grid-template-columns: max-content 1fr; gap: 0.4rem 1rem; margin: 0; }
    dt { color: var(--muted); }
    dd { margin: 0; }
  `,
})
export class CardDetail {
  readonly card = input.required<Card>();
}
