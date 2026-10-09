import { Component, Input } from '@angular/core';
import { CuentaResumen } from '../../core/cuenta.model';
import { MontoComponent } from '../atoms/monto.component';
import { BadgeEstadoComponent } from '../atoms/badge-estado.component';
import { NumeroEnmascaradoComponent } from '../atoms/numero-enmascarado.component';

@Component({
  selector: 'app-cuenta-item',
  standalone: true,
  imports: [MontoComponent, BadgeEstadoComponent, NumeroEnmascaradoComponent],
  template: `
    <article class="item">
      <div>
        <h3>{{ cuenta.tipo === 'AHORRO' ? 'Cuenta de ahorro' : 'Cuenta corriente' }}</h3>
        <app-numero-enmascarado [numero]="cuenta.numeroEnmascarado" />
      </div>
      <div class="saldo">
        <small>Saldo disponible</small>
        <app-monto [valor]="cuenta.saldoDisponible" [moneda]="cuenta.moneda" />
        <app-badge-estado [estado]="cuenta.estado" />
      </div>
    </article>
  `,
  styles: [
    `.item { display: flex; flex-wrap: wrap; justify-content: space-between; gap: var(--space-4);
             padding: var(--space-4); background: var(--surface); border: 1px solid var(--border);
             border-radius: var(--radius-md); box-shadow: var(--shadow-sm); }
     h3 { margin: 0 0 var(--space-1); font-size: 1.05rem; }
     .saldo { display: flex; flex-direction: column; align-items: flex-end; gap: var(--space-1); }
     small { color: var(--muted); }`,
  ],
})
export class CuentaItemComponent {
  @Input({ required: true }) cuenta!: CuentaResumen;
}
