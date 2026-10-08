import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-masked-pan',
  standalone: true,
  template: `<span class="pan" [attr.aria-label]="'Tarjeta terminada en ' + last4">{{ value }}</span>`,
  styles: [`.pan { font-variant-numeric: tabular-nums; letter-spacing: 0.04em; }`],
})
export class MaskedPanComponent {
  @Input({ required: true }) value!: string;

  get last4(): string {
    return this.value.slice(-4);
  }
}
