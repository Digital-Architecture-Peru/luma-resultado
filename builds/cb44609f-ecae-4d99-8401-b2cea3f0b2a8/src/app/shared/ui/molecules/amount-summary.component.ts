import { CurrencyPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'ui-amount-summary',
  standalone: true,
  imports: [CurrencyPipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="summary">
      <span>{{ label() }}</span>
      <strong>{{ amountCents() / 100 | currency: currency() }}</strong>
    </div>
  `,
})
export class UiAmountSummaryComponent {
  readonly label = input.required<string>();
  readonly amountCents = input.required<number>();
  readonly currency = input('PEN');
}
