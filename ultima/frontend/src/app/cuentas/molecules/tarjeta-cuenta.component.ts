import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { Cuenta } from '../models/cuenta.model';
import { MontoComponent } from '../atoms/monto.component';
import { BadgeEstadoComponent } from '../atoms/badge-estado.component';

/** Molecule: resumen seleccionable de una cuenta. */
@Component({
  selector: 'app-tarjeta-cuenta',
  standalone: true,
  imports: [MontoComponent, BadgeEstadoComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <button type="button" class="tarjeta" (click)="seleccionar.emit(cuenta)"
            [attr.aria-label]="'Ver detalle de cuenta ' + cuenta.numeroEnmascarado">
      <span class="tipo">{{ cuenta.tipo === 'AHORRO' ? 'Ahorro' : 'Corriente' }}</span>
      <span class="numero">{{ cuenta.numeroEnmascarado }}</span>
      <app-monto [valor]="cuenta.saldo" [moneda]="cuenta.moneda" />
      <app-badge-estado [estado]="cuenta.estado" />
    </button>
  `,
  styles: [`
    .tarjeta { display: grid; gap: var(--space-2); width: 100%; text-align: start; cursor: pointer;
      min-height: 44px; padding: var(--space-4); color: var(--text); background: var(--surface);
      border: 1px solid var(--border); border-radius: var(--radius-md); box-shadow: var(--shadow-sm);
      font: inherit; }
    .tarjeta:hover { border-color: var(--primary); }
    .tipo { color: var(--muted); font-size: .85rem; }
    .numero { font-size: 1.1rem; letter-spacing: .05em; }
  `]
})
export class TarjetaCuentaComponent {
  @Input({ required: true }) cuenta!: Cuenta;
  @Output() readonly seleccionar = new EventEmitter<Cuenta>();
}
