import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-amount-text',
  standalone: true,
  template: '<span class="amount">{{ formatted }}</span>',
})
export class AmountTextComponent {
  @Input({ required: true }) amount!: number;
  @Input({ required: true }) currency!: string;

  get formatted(): string {
    return `${this.currency} ${this.amount.toFixed(2)}`;
  }
}
