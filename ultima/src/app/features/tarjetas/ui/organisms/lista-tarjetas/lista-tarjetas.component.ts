import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { Tarjeta } from '../../../domain/tarjeta.model';
import { TarjetaResumenComponent } from '../../molecules/tarjeta-resumen/tarjeta-resumen.component';

@Component({
  selector: 'app-lista-tarjetas',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [TarjetaResumenComponent],
  template: `
    <ul class="lista" aria-label="Listado de tarjetas">
      @for (tarjeta of tarjetas; track tarjeta.id) {
        <li>
          <app-tarjeta-resumen [tarjeta]="tarjeta" (seleccionar)="seleccionar.emit($event)" />
        </li>
      }
    </ul>
  `,
  styles: [
    `
      .lista {
        list-style: none;
        margin: 0;
        padding: 0;
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(16rem, 1fr));
        gap: var(--space-4);
      }
    `,
  ],
})
export class ListaTarjetasComponent {
  @Input({ required: true }) tarjetas: readonly Tarjeta[] = [];
  @Output() readonly seleccionar = new EventEmitter<Tarjeta>();
}
