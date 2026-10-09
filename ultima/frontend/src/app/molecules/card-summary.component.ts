import { CurrencyPipe } from '@angular/common';
import { Component, Input } from '@angular/core';
import { MaskedPanComponent } from '../atoms/masked-pan.component';
import { Card } from '../core/models';

@Component({
  selector: 'app-card-summary',
  standalone: true,
  imports: [MaskedPanComponent, CurrencyPipe],
  template: `
    <section class="card summary" aria-label="Resumen de la tarjeta">
      <h2>{{ card.alias }}</h2>
      <app-masked-pan [pan]="card.maskedPan" />
      <dl>
        <div><dt>Límite</dt><dd>{{ card.creditLimit | currency: card.currency }}</dd></div>
        <div><dt>Disponible</dt><dd>{{ card.availableBalance | currency: card.currency }}</dd></div>
        <div><dt>Deuda pendiente</dt><dd>{{ card.outstandingBalance | currency: card.currency }}</dd></div>
      </dl>
    </section>
  `,
})
export class CardSummaryComponent {
  @Input({ required: true }) card!: Card;
}
