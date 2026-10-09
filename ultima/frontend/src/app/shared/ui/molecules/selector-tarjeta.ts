import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { Tarjeta } from '../../../features/transaccion-tarjeta/models/transaccion.model';
import { EtiquetaTarjeta } from '../atoms/etiqueta-tarjeta';

/** Molecule: lista de tarjetas seleccionables; las bloqueadas se deshabilitan. */
@Component({
  selector: 'app-selector-tarjeta',
  imports: [EtiquetaTarjeta],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <fieldset>
      <legend>Tarjeta</legend>
      @for (t of tarjetas(); track t.id) {
        <label class="opcion">
          <input
            type="radio"
            name="tarjeta"
            [value]="t.id"
            [checked]="t.id === seleccionada()"
            [disabled]="t.estado !== 'ACTIVA'"
            (change)="seleccionar.emit(t.id)"
          />
          <app-etiqueta-tarjeta [ultimos4]="t.ultimos4" [tipo]="t.tipo" />
          @if (t.estado !== 'ACTIVA') {
            <span class="estado">(bloqueada)</span>
          }
        </label>
      } @empty {
        <p>No hay tarjetas disponibles.</p>
      }
    </fieldset>
  `,
  styles: `
    fieldset { border: 1px solid var(--border); border-radius: var(--radius-md); padding: var(--space-3); }
    .opcion { display: flex; gap: var(--space-2); align-items: center; min-height: 44px; }
    .estado { color: var(--muted); }
  `,
})
export class SelectorTarjeta {
  readonly tarjetas = input.required<Tarjeta[]>();
  readonly seleccionada = input<number | null>(null);
  readonly seleccionar = output<number>();
}
