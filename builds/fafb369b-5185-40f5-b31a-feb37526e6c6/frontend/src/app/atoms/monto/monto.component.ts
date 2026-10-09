import { DecimalPipe } from '@angular/common';
import { Component, Input } from '@angular/core';

/** Átomo: importe con dos decimales y moneda ISO. */
@Component({
  selector: 'app-monto',
  standalone: true,
  imports: [DecimalPipe],
  template: `<span class="monto">{{ monto | number: '1.2-2' }} {{ moneda }}</span>`,
  styles: [`.monto { font-variant-numeric: tabular-nums; white-space: nowrap; }`],
})
export class MontoComponent {
  @Input({ required: true }) monto!: number;
  @Input({ required: true }) moneda!: string;
}
