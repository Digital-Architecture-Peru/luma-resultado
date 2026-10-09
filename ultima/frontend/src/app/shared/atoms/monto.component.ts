import { Component, Input } from '@angular/core';
import { CurrencyPipe } from '@angular/common';

@Component({
  selector: 'app-monto',
  standalone: true,
  imports: [CurrencyPipe],
  template: '<span class="monto">{{ valor | currency: moneda : "symbol" : "1.2-2" }}</span>',
  styles: ['.monto { font-variant-numeric: tabular-nums; font-weight: 600; }'],
})
export class MontoComponent {
  @Input({ required: true }) valor = 0;
  @Input() moneda = 'PEN';
}
