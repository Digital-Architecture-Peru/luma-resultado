import { CurrencyPipe } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-money',
  standalone: true,
  imports: [CurrencyPipe],
  template: `<span class="money">{{ amount | currency: currency : 'symbol' : '1.2-2' }}</span>`,
})
export class MoneyComponent {
  @Input({ required: true }) amount!: number;
  @Input() currency = 'USD';
}
