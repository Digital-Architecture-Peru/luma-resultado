import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-masked-pan',
  standalone: true,
  template: `<span class="pan" [attr.aria-label]="'Tarjeta terminada en ' + last4">{{ pan }}</span>`,
  styles: [`.pan { font-variant-numeric: tabular-nums; letter-spacing: 0.05em; font-weight: 600; }`],
})
export class MaskedPanComponent {
  @Input({ required: true }) pan = '';

  get last4(): string {
    return this.pan.slice(-4);
  }
}
