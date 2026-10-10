import { Component, EventEmitter, Input, Output, signal } from '@angular/core';
import { Preferencia } from '../data/models';
import { BotonComponent } from '../atoms/boton.component';
import { TogglePreferenciaComponent } from '../molecules/toggle-preferencia.component';

@Component({
  selector: 'app-panel-preferencias',
  standalone: true,
  imports: [BotonComponent, TogglePreferenciaComponent],
  template: `
    <section aria-labelledby="titulo-pref">
      <h2 id="titulo-pref">Preferencias</h2>
      @for (p of editable(); track p.tipo + p.canal; let i = $index) {
        <app-toggle-preferencia
          [etiqueta]="p.tipo + ' (' + p.canal + ')'"
          [habilitada]="p.habilitada"
          (cambio)="actualizar(i, $event)" />
      }
      <app-boton etiqueta="Guardar preferencias" [disabled]="guardando" (pulsado)="guardar.emit(editable())" />
    </section>
  `
})
export class PanelPreferenciasComponent {
  readonly editable = signal<Preferencia[]>([]);
  @Input() guardando = false;
  @Output() readonly guardar = new EventEmitter<Preferencia[]>();

  @Input() set preferencias(valor: Preferencia[]) {
    this.editable.set(valor.map(p => ({ ...p })));
  }

  actualizar(indice: number, habilitada: boolean): void {
    this.editable.update(lista => lista.map((p, i) => (i === indice ? { ...p, habilitada } : p)));
  }
}
