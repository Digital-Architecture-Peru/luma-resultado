import { Component, EventEmitter, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ESTADOS, EstadoPago } from '../data/pago.model';

export interface CriteriosFiltro {
  desde: string;
  hasta: string;
  estado: EstadoPago | '';
}

/** Molecula: campos de filtro y boton de consulta. Emite fechas en formato yyyy-MM-dd. */
@Component({
  selector: 'app-filtro-fechas',
  standalone: true,
  imports: [FormsModule],
  template: `
    <form (ngSubmit)="consultar()" class="filtro">
      <label>Desde <input type="date" name="desde" [(ngModel)]="desde" /></label>
      <label>Hasta <input type="date" name="hasta" [(ngModel)]="hasta" /></label>
      <label>
        Estado
        <select name="estado" [(ngModel)]="estado">
          <option value="">Todos</option>
          @for (e of estados; track e) {
            <option [value]="e">{{ e }}</option>
          }
        </select>
      </label>
      <button type="submit">Consultar</button>
    </form>
  `,
  styles: ['.filtro { display: flex; flex-wrap: wrap; gap: var(--space-3); align-items: end; } label { display: grid; gap: var(--space-1); }'],
})
export class FiltroFechasComponent {
  readonly estados = ESTADOS;
  desde = '';
  hasta = '';
  estado: EstadoPago | '' = '';

  @Output() buscar = new EventEmitter<CriteriosFiltro>();

  consultar(): void {
    this.buscar.emit({ desde: this.desde, hasta: this.hasta, estado: this.estado });
  }
}
