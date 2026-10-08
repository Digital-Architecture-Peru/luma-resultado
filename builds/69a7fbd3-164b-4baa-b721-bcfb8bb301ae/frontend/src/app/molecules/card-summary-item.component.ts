import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Card } from '../core/models';
import { BadgeStatusComponent } from '../atoms/badge-status.component';
import { MaskedPanComponent } from '../atoms/masked-pan.component';
import { MoneyComponent } from '../atoms/money.component';

@Component({
  selector: 'app-card-summary-item',
  standalone: true,
  imports: [RouterLink, BadgeStatusComponent, MaskedPanComponent, MoneyComponent],
  template: `
    <a class="card-item" [routerLink]="['/cards', card.id]">
      <span class="card-item__title">{{ card.brand }} · {{ card.product }}</span>
      <app-masked-pan [maskedPan]="card.maskedPan" />
      <app-badge-status [status]="card.status" />
      <span>Disponible: <app-money [amount]="card.available" [currency]="card.currency" /></span>
    </a>
  `,
})
export class CardSummaryItemComponent {
  @Input({ required: true }) card!: Card;
}
