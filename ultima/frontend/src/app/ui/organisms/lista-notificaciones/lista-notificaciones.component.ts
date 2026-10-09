import { Component, input, output } from '@angular/core';
import { Notificacion } from '../../../core/models/notificacion.model';
import { ItemNotificacionComponent } from '../../molecules/item-notificacion/item-notificacion.component';

/** Organismo: lista de notificaciones con estado vacío. */
@Component({
  selector: 'app-lista-notificaciones',
  standalone: true,
  imports: [ItemNotificacionComponent],
  template: `
    @if (items().length === 0) {
      <p class="vacio">No hay notificaciones para mostrar.</p>
    } @else {
      <ul class="lista">
        @for (n of items(); track n.id) {
          <li><app-item-notificacion [notificacion]="n" (marcar)="marcar.emit($event)" /></li>
        }
      </ul>
    }
  `,
  styles: [
    `
      .lista { list-style: none; margin: 0; padding: 0; display: grid; gap: 0.5rem; }
      .vacio { color: #4b5563; padding: 1rem 0; }
    `,
  ],
})
export class ListaNotificacionesComponent {
  readonly items = input.required<Notificacion[]>();
  readonly marcar = output<number>();
}
