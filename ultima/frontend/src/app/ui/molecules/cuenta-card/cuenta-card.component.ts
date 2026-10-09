import { Component, Input } from '@angular/core';
import { Cuenta, EstadoCuenta } from '../../../features/cuentas/models/cuenta.model';
import { BadgeComponent, TonoBadge } from '../../atoms/badge/badge.component';
import { MontoComponent } from '../../atoms/monto/monto.component';

const TONO_POR_ESTADO: Record<EstadoCuenta, TonoBadge> = {
  ACTIVA: 'ok',
  BLOQUEADA: 'warn',
  CERRADA: 'off',
};

/** Molécula: resumen de una cuenta compuesto por átomos. */
@Component({
  selector: 'app-cuenta-card',
  standalone: true,
  imports: [BadgeComponent, MontoComponent],
  template: `
    <article class="cuenta-card">
      <div class="cuenta-card__cabecera">
        <h2 class="cuenta-card__tipo">{{ cuenta.tipo }}</h2>
        <app-badge [texto]="cuenta.estado" [tono]="tono" />
      </div>
      <p class="cuenta-card__numero">{{ cuenta.numeroEnmascarado }}</p>
      <app-monto [valor]="cuenta.saldoDisponible" [moneda]="cuenta.moneda" />
      <p class="cuenta-card__fecha">Apertura: {{ cuenta.fechaApertura }}</p>
    </article>
  `,
})
export class CuentaCardComponent {
  @Input({ required: true }) cuenta!: Cuenta;

  get tono(): TonoBadge {
    return TONO_POR_ESTADO[this.cuenta.estado] ?? 'off';
  }
}
