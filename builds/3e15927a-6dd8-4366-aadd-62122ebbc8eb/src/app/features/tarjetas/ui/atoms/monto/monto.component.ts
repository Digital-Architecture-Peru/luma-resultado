import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: 'app-monto',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<span class="monto">{{ formateado }}</span>`,
  styles: [`.monto { font-variant-numeric: tabular-nums; font-weight: 600; }`],
})
export class MontoComponent {
  @Input({ required: true }) valor!: number;
  @Input() moneda = 'PEN';

  get formateado(): string {
    return new Intl.NumberFormat('es-PE', { style: 'currency', currency: this.moneda }).format(
      this.valor,
    );
  }
}
