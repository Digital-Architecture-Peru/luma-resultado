import { DecimalPipe } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-amount-display',
  standalone: true,
  imports: [DecimalPipe],
  template: `<span class="amount">{{ amount | number: '1.2-2' }} {{ currency }}</span>`
})
export class AmountDisplayComponent {
  @Input({ required: true }) amount!: number;
  @Input() currency = 'PEN';
}
