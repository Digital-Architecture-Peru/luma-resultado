import { CurrencyPipe } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-amount',
  standalone: true,
  imports: [CurrencyPipe],
  template: `<span class="amount">{{ value | currency: currency }}</span>`,
  styles: [`.amount { font-variant-numeric: tabular-nums; font-weight: 600; }`],
})
export class AmountComponent {
  @Input({ required: true }) value!: number;
  @Input({ required: true }) currency!: string;
}
