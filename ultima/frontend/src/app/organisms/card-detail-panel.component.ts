import { Component, Input } from '@angular/core';
import { Card } from '../core/models';
import { BadgeStatusComponent } from '../atoms/badge-status.component';
import { MaskedPanComponent } from '../atoms/masked-pan.component';
import { MoneyComponent } from '../atoms/money.component';

@Component({
  selector: 'app-card-detail-panel',
  standalone: true,
  imports: [BadgeStatusComponent, MaskedPanComponent, MoneyComponent],
  template: `
    <section class="panel" aria-label="Detalle de la tarjeta">
      <dl>
        <div><dt>Tarjeta</dt><dd>{{ card.brand }} · {{ card.product }}</dd></div>
        <div><dt>Número</dt><dd><app-masked-pan [maskedPan]="card.maskedPan" /></dd></div>
        <div><dt>Estado</dt><dd><app-badge-status [status]="card.status" /></dd></div>
        <div><dt>Vence</dt><dd>{{ card.expiry }}</dd></div>
        <div><dt>Límite</dt><dd><app-money [amount]="card.creditLimit" [currency]="card.currency" /></dd></div>
        <div><dt>Disponible</dt><dd><app-money [amount]="card.available" [currency]="card.currency" /></dd></div>
      </dl>
    </section>
  `,
})
export class CardDetailPanelComponent {
  @Input({ required: true }) card!: Card;
}
