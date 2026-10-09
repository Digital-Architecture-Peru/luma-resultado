import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

/** Atom: importe formateado según la moneda de la cuenta. */
@Component({
  selector: 'app-monto',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<span class="monto">{{ formateado }}</span>`,
  styles: [`.monto { font-variant-numeric: tabular-nums; font-weight: 600; }`]
})
export class MontoComponent {
  @Input({ required: true }) valor = 0;
  @Input({ required: true }) moneda = 'PEN';

  get formateado(): string {
    return new Intl.NumberFormat('es', {
      style: 'currency',
      currency: this.moneda,
      currencyDisplay: 'code'
    }).format(this.valor);
  }
}
