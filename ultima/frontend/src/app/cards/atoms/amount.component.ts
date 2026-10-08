import { Component, Input } from '@angular/core';
import { formatAmount } from '../data/card.model';

@Component({
  selector: 'app-amount',
  standalone: true,
  template: `<span class="amount">{{ text }}</span>`,
  styles: [`.amount { font-variant-numeric: tabular-nums; font-weight: 600; }`],
})
export class AmountComponent {
  @Input({ required: true }) value = 0;
  @Input({ required: true }) currency = 'USD';

  get text(): string {
    return formatAmount(this.value, this.currency);
  }
}
