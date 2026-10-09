import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { AmountOptionsComponent } from '../molecules/amount-options.component';
import { CardItemComponent } from '../molecules/card-item.component';
import { MoneyPipe } from '../atoms/money.pipe';
import { PaymentFlow } from '../domain/payment-flow';

/** Organismo: formulario de pago (tarjeta, cuenta de origen y monto). */
@Component({
  selector: 'app-payment-form',
  standalone: true,
  imports: [CardItemComponent, AmountOptionsComponent, MoneyPipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <form (submit)="$event.preventDefault(); flow.review()" novalidate>
      <h2>1. Elige la tarjeta</h2>
      <div class="card-grid">
        @for (card of flow.cards(); track card.id) {
          <app-card-item [card]="card" [selected]="flow.cardId() === card.id" (picked)="flow.selectCard($event)" />
        }
      </div>

      <h2>2. Cuenta de origen</h2>
      <label class="field">
        <span>Debitar de</span>
        <select [value]="flow.accountId() ?? ''" (change)="onAccount($event)">
          <option value="">Selecciona una cuenta</option>
          @for (account of flow.accounts(); track account.id) {
            <option [value]="account.id" [selected]="flow.accountId() === account.id">
              {{ account.alias }} {{ account.maskedNumber }} · {{ account.available | money }}
            </option>
          }
        </select>
      </label>

      <h2>3. Monto</h2>
      <app-amount-options
        [mode]="flow.mode()"
        [custom]="flow.customAmount()"
        (modeChange)="flow.setMode($event)"
        (customChange)="flow.setCustomAmount($event)"
      />
      <p class="summary">Total a pagar: <strong>{{ flow.amount() | money }}</strong></p>

      @if (flow.errors().length > 0) {
        <ul class="errors" role="alert">
          @for (error of flow.errors(); track error) {
            <li>{{ error }}</li>
          }
        </ul>
      }
      <button type="submit" class="btn btn--primary">Continuar</button>
    </form>
  `,
})
export class PaymentFormComponent {
  protected readonly flow = inject(PaymentFlow);

  protected onAccount(event: Event): void {
    const value = (event.target as HTMLSelectElement).value;
    if (value !== '') {
      this.flow.selectAccount(value);
    }
  }
}
