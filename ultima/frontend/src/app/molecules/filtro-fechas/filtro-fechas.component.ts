import { Component, EventEmitter, Input, Output } from '@angular/core';

export interface RangoFechas {
  desde: string;
  hasta: string;
}

/** Molécula: dos campos de fecha con etiquetas asociadas. */
@Component({
  selector: 'app-filtro-fechas',
  standalone: true,
  template: `
    <label>
      Desde
      <input type="date" [value]="desde" (change)="cambiarDesde($event)" />
    </label>
    <label>
      Hasta
      <input type="date" [value]="hasta" (change)="cambiarHasta($event)" />
    </label>
  `,
  styles: [`:host { display: contents; } label { display: grid; gap: 0.25rem; font-size: 0.875rem; color: var(--muted); }`],
})
export class FiltroFechasComponent {
  @Input() desde = '';
  @Input() hasta = '';
  @Output() rangoCambio = new EventEmitter<RangoFechas>();

  cambiarDesde(evento: Event): void {
    this.rangoCambio.emit({ desde: (evento.target as HTMLInputElement).value, hasta: this.hasta });
  }

  cambiarHasta(evento: Event): void {
    this.rangoCambio.emit({ desde: this.desde, hasta: (evento.target as HTMLInputElement).value });
  }
}
