import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-masked-number',
  standalone: true,
  template: `<span class="num" [attr.aria-label]="ariaLabel">{{ value }}</span>`,
  styles: [`.num { font-variant-numeric: tabular-nums; letter-spacing: 0.06em; }`],
})
export class MaskedNumberComponent {
  @Input({ required: true }) value = '';
  @Input({ required: true }) last4 = '';

  get ariaLabel(): string {
    return `Número de tarjeta terminado en ${this.last4}`;
  }
}
