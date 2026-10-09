import { Component, input, output } from '@angular/core';
import { ESTADOS_PAGO, ETIQUETA_ESTADO, FiltroEstado, esFiltroEstado } from '../domain/pago.model';

/** Molécula: búsqueda por texto + filtro de estado + limpiar. */
@Component({
  selector: 'app-filter-bar',
  standalone: true,
  template: `
    <form class="filter-bar" (submit)="$event.preventDefault()" role="search" aria-label="Filtros de pagos">
      <div class="field">
        <label for="filtro-texto">Buscar</label>
        <input id="filtro-texto" type="search" placeholder="Beneficiario, concepto o referencia"
          [value]="texto()" (input)="onTexto($event)" />
      </div>
      <div class="field">
        <label for="filtro-estado">Estado</label>
        <select id="filtro-estado" [value]="estado()" (change)="onEstado($event)">
          <option value="TODOS">Todos</option>
          @for (e of estados; track e) {
            <option [value]="e" [selected]="e === estado()">{{ etiquetas[e] }}</option>
          }
        </select>
      </div>
      <button type="button" class="btn" (click)="limpiar.emit()">Limpiar filtros</button>
    </form>
  `,
})
export class FilterBarComponent {
  readonly texto = input.required<string>();
  readonly estado = input.required<FiltroEstado>();
  readonly textoChange = output<string>();
  readonly estadoChange = output<FiltroEstado>();
  readonly limpiar = output<void>();

  protected readonly estados = ESTADOS_PAGO;
  protected readonly etiquetas = ETIQUETA_ESTADO;

  protected onTexto(event: Event): void {
    this.textoChange.emit((event.target as HTMLInputElement).value);
  }

  protected onEstado(event: Event): void {
    const valor = (event.target as HTMLSelectElement).value;
    if (esFiltroEstado(valor)) {
      this.estadoChange.emit(valor);
    }
  }
}
