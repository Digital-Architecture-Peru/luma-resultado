import { CurrencyPipe } from '@angular/common';
import { Component, Input } from '@angular/core';

/** Atomo: importe con su moneda ISO 4217. */
@Component({
  selector: 'app-monto',
  standalone: true,
  imports: [CurrencyPipe],
  template: `<span class="monto">{{ valor | currency: moneda }}</span>`,
  styles: ['.monto { font-variant-numeric: tabular-nums; }'],
})
export class MontoComponent {
  @Input({ required: true }) valor!: number;
  @Input({ required: true }) moneda!: string;
}
