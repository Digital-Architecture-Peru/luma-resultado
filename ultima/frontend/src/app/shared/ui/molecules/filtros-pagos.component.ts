import { ChangeDetectionStrategy, Component, EventEmitter, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ESTADOS_PAGO, EstadoPago, FiltroPagos } from '../../../features/pagos/models/pago.model';

/** Molécula: formulario de filtros por estado y rango de fechas. */
@Component({
  selector: 'app-filtros-pagos',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FormsModule],
  template: `
    <form class="filtros" (ngSubmit)="buscar()">
      <label>Estado
        <select name="estado" [(ngModel)]="estado">
          <option value="">Todos</option>
          @for (e of estados; track e) {
            <option [value]="e">{{ e }}</option>
          }
        </select>
      </label>
      <label>Desde
        <input type="date" name="desde" [(ngModel)]="desde" />
      </label>
      <label>Hasta
        <input type="date" name="hasta" [(ngModel)]="hasta" />
      </label>
      <button type="submit" class="primario">Consultar</button>
    </form>
  `,
  styles: [`
    .filtros { display: flex; flex-wrap: wrap; gap: var(--space-4); align-items: end; }
    label { display: flex; flex-direction: column; gap: var(--space-1); font-size: 0.9rem; }
  `],
})
export class FiltrosPagosComponent {
  @Output() readonly filtrar = new EventEmitter<FiltroPagos>();

  readonly estados = ESTADOS_PAGO;
  estado: EstadoPago | '' = '';
  desde = '';
  hasta = '';

  buscar(): void {
    this.filtrar.emit({ estado: this.estado, desde: this.desde, hasta: this.hasta });
  }
}
