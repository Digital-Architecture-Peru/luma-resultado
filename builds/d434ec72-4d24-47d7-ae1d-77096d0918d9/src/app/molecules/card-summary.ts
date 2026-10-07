import { CurrencyPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { Card } from '../domain/card.model';
import { StatusBadge } from '../atoms/status-badge';

@Component({
  selector: 'app-card-summary',
  imports: [CurrencyPipe, StatusBadge],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <article class="card-summary" aria-label="Resumen de la tarjeta">
      <h3>{{ card().alias }}</h3>
      <p class="mono">{{ card().maskedNumber }}</p>
      <p>
        Crédito disponible:
        <strong>{{ card().availableCredit | currency: card().currency : 'symbol' : '1.2-2' }}</strong>
      </p>
      <p>Línea: {{ card().creditLimit | currency: card().currency : 'symbol' : '1.2-2' }}</p>
      <app-status-badge
        [text]="card().status === 'ACTIVE' ? 'Activa' : 'Bloqueada'"
        [tone]="card().status === 'ACTIVE' ? 'success' : 'danger'"
      />
    </article>
  `,
})
export class CardSummary {
  readonly card = input.required<Card>();
}
