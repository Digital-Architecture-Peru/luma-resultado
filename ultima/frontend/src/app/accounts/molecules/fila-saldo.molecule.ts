import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { MontoComponent } from '../atoms/monto.atom';

@Component({
  selector: 'app-fila-saldo',
  standalone: true,
  imports: [MontoComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="fila">
      <dt>{{ etiqueta }}</dt>
      <dd><app-monto [value]="valor" [currency]="moneda" /></dd>
    </div>
  `,
  styles: [
    `
      .fila { display: flex; justify-content: space-between; padding: var(--space-2) 0; border-bottom: 1px solid var(--border); }
      dt { color: var(--muted); }
      dd { margin: 0; }
    `
  ]
})
export class FilaSaldoComponent {
  @Input({ required: true }) etiqueta = '';
  @Input({ required: true }) valor = 0;
  @Input({ required: true }) moneda = 'PEN';
}
