import { CurrencyPipe } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-amount',
  standalone: true,
  imports: [CurrencyPipe],
  template: `<span class="amount">{{ value | currency: currency : 'symbol' : '1.2-2' }}</span>`,
  styles: [`.amount { font-variant-numeric: tabular-nums; font-weight: 600; }`],
})
export class AmountComponent {
  @Input({ required: true }) value = 0;
  @Input() currency = 'USD';
}
