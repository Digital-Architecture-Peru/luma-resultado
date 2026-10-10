import { Component, EventEmitter, Input, Output } from '@angular/core';
import { EstadoCarga, Notificacion } from '../data/models';
import { ItemNotificacionComponent } from '../molecules/item-notificacion.component';

@Component({
  selector: 'app-lista-notificaciones',
  standalone: true,
  imports: [ItemNotificacionComponent],
  template: `
    @switch (estado) {
      @case ('loading') { <p>Cargando notificaciones…</p> }
      @case ('error') { <p role="alert">No se pudieron cargar las notificaciones.</p> }
      @default {
        @if (items.length === 0) {
          <p>No tienes notificaciones.</p>
        } @else {
          <ul class="lista">
            @for (n of items; track n.id) {
              <li><app-item-notificacion [notificacion]="n" (marcar)="marcar.emit($event)" /></li>
            }
          </ul>
        }
      }
    }
  `,
  styles: [`.lista { list-style: none; margin: 0; padding: 0; display: grid; gap: var(--space-3); }`]
})
export class ListaNotificacionesComponent {
  @Input() items: Notificacion[] = [];
  @Input() estado: EstadoCarga = 'idle';
  @Output() readonly marcar = new EventEmitter<string>();
}
