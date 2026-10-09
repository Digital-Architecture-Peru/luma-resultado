import { CurrencyPipe } from '@angular/common';
import { Component, Input } from '@angular/core';

/** Átomo: importe formateado en su moneda (ISO 4217). */
@Component({
  selector: 'app-monto',
  standalone: true,
  imports: [CurrencyPipe],
  template: '<span class="monto">{{ valor | currency: moneda }}</span>',
})
export class MontoComponent {
  @Input() valor = 0;
  @Input() moneda = 'PEN';
}
