import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { Cuenta } from '../models/cuenta.model';
import { MontoComponent } from '../atoms/monto.component';
import { BadgeEstadoComponent } from '../atoms/badge-estado.component';

/** Organism: ficha completa de una cuenta. */
@Component({
  selector: 'app-detalle-cuenta',
  standalone: true,
  imports: [MontoComponent, BadgeEstadoComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="detalle" aria-label="Detalle de cuenta">
      <h3>Cuenta {{ cuenta.tipo === 'AHORRO' ? 'de ahorro' : 'corriente' }} {{ cuenta.numeroEnmascarado }}</h3>
      <dl>
        <dt>Saldo</dt><dd><app-monto [valor]="cuenta.saldo" [moneda]="cuenta.moneda" /></dd>
        <dt>Moneda</dt><dd>{{ cuenta.moneda }}</dd>
        <dt>Estado</dt><dd><app-badge-estado [estado]="cuenta.estado" /></dd>
        <dt>Fecha de apertura</dt><dd>{{ cuenta.fechaApertura }}</dd>
      </dl>
    </section>
  `,
  styles: [`
    .detalle { background: var(--surface); border: 1px solid var(--border);
      border-radius: var(--radius-md); padding: var(--space-4); }
    dl { display: grid; grid-template-columns: max-content 1fr; gap: var(--space-2) var(--space-6); margin: 0; }
    dt { color: var(--muted); }
    dd { margin: 0; }
  `]
})
export class DetalleCuentaComponent {
  @Input({ required: true }) cuenta!: Cuenta;
}
