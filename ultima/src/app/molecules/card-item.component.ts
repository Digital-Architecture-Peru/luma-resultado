import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { StatusBadgeComponent } from '../atoms/status-badge.component';
import { UsageBarComponent } from '../atoms/usage-bar.component';
import { creditUsagePercent, formatMoney, maskCardNumber, typeLabel } from '../domain/card-format';
import { Card } from '../domain/card.model';

@Component({
  selector: 'app-card-item',
  standalone: true,
  imports: [StatusBadgeComponent, UsageBarComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <article class="card" [attr.aria-label]="card.brand + ' terminada en ' + card.last4">
      <header class="card__header">
        <h3 class="card__title">{{ card.brand }} · {{ type }}</h3>
        <app-status-badge [status]="card.status" />
      </header>
      <p class="card__number">{{ masked }}</p>
      <dl class="card__details">
        <div>
          <dt>Titular</dt>
          <dd>{{ card.holder }}</dd>
        </div>
        <div>
          <dt>Vence</dt>
          <dd>{{ card.expiry }}</dd>
        </div>
        <div>
          <dt>Saldo disponible</dt>
          <dd class="num">{{ balance }}</dd>
        </div>
        @if (card.creditLimit) {
          <div>
            <dt>Línea de crédito</dt>
            <dd class="num">{{ limit }}</dd>
          </div>
        }
      </dl>
      @if (usage !== undefined) {
        <app-usage-bar [percent]="usage" />
      }
    </article>
  `,
})
export class CardItemComponent {
  @Input({ required: true }) card!: Card;

  get masked(): string {
    return maskCardNumber(this.card.last4);
  }

  get type(): string {
    return typeLabel(this.card.type);
  }

  get balance(): string {
    return formatMoney(this.card.availableBalance, this.card.currency);
  }

  get limit(): string {
    return formatMoney(this.card.creditLimit ?? 0, this.card.currency);
  }

  get usage(): number | undefined {
    return creditUsagePercent(this.card);
  }
}
