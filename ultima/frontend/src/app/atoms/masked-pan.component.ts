import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-masked-pan',
  standalone: true,
  template: `<span class="pan" [attr.aria-label]="'Tarjeta terminada en ' + lastDigits">{{ pan }}</span>`,
})
export class MaskedPanComponent {
  @Input({ required: true }) pan = '';

  get lastDigits(): string {
    return this.pan.replace(/\D/g, '').slice(-4);
  }
}
