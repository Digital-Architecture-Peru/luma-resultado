import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { DatePipe } from '@angular/common';
import { Cuenta } from '../data/account.model';
import { BadgeEstadoComponent } from '../atoms/badge-estado.atom';
import { NumeroEnmascaradoComponent } from '../atoms/numero-enmascarado.atom';
import { FilaSaldoComponent } from '../molecules/fila-saldo.molecule';

@Component({
  selector: 'app-detalle-cuenta',
  standalone: true,
  imports: [BadgeEstadoComponent, NumeroEnmascaradoComponent, FilaSaldoComponent, DatePipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="detalle">
      <header>
        <h2>{{ cuenta.productType }}</h2>
        <app-badge-estado [estado]="cuenta.status" />
      </header>
      <app-numero-enmascarado [value]="cuenta.maskedNumber" />
      <dl>
        <app-fila-saldo etiqueta="Saldo disponible" [valor]="cuenta.availableBalance" [moneda]="cuenta.currency" />
        <app-fila-saldo etiqueta="Saldo contable" [valor]="cuenta.ledgerBalance" [moneda]="cuenta.currency" />
      </dl>
      <p class="meta">Apertura: {{ cuenta.openedAt | date: 'dd/MM/yyyy' }} · Actualizado: {{ cuenta.updatedAt | date: 'dd/MM/yyyy HH:mm' }}</p>
    </section>
  `,
  styles: [
    `
      .detalle { padding: var(--space-6); background: var(--surface); border: 1px solid var(--border);
        border-radius: var(--radius-lg); box-shadow: var(--shadow-sm); }
      header { display: flex; justify-content: space-between; align-items: center; }
      dl { margin: var(--space-4) 0; }
      .meta { color: var(--muted); font-size: 0.875rem; }
    `
  ]
})
export class DetalleCuentaComponent {
  @Input({ required: true }) cuenta!: Cuenta;
}
