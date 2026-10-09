import { Component, OnInit, inject, signal } from '@angular/core';
import { Notificacion } from '../core/models/notificacion.model';
import { NotificacionService } from '../core/services/notificacion.service';
import { LayoutNotificacionesComponent } from '../ui/templates/layout-notificaciones/layout-notificaciones.component';
import { ListaNotificacionesComponent } from '../ui/organisms/lista-notificaciones/lista-notificaciones.component';

type Estado = 'cargando' | 'listo' | 'error';

/** Página: orquesta datos (servicio) y componentes de presentación. */
@Component({
  selector: 'app-notificaciones-tarjeta-page',
  standalone: true,
  imports: [LayoutNotificacionesComponent, ListaNotificacionesComponent],
  template: `
    <app-layout-notificaciones>
      <div controles class="controles">
        <label>
          Tarjeta
          <select (change)="cambiarTarjeta($any($event.target).value)">
            @for (t of tarjetas; track t) {
              <option [value]="t" [selected]="t === tarjetaId()">{{ t }}</option>
            }
          </select>
        </label>
        <label>
          <input
            type="checkbox"
            [checked]="soloNoLeidas()"
            (change)="cambiarFiltro($any($event.target).checked)"
          />
          Solo no leídas
        </label>
      </div>

      @switch (estado()) {
        @case ('cargando') { <p role="status">Cargando notificaciones…</p> }
        @case ('error') {
          <p role="alert">No se pudieron cargar las notificaciones.</p>
          <button type="button" (click)="cargar()">Reintentar</button>
        }
        @default {
          <p class="total" role="status">{{ total() }} notificación(es)</p>
          <app-lista-notificaciones [items]="items()" (marcar)="marcarLeida($event)" />
        }
      }
    </app-layout-notificaciones>
  `,
  styles: [
    `
      .controles { display: flex; flex-wrap: wrap; gap: 1rem; align-items: center; }
      select { min-height: 40px; margin-inline-start: 0.5rem; }
      .total { color: #4b5563; }
    `,
  ],
})
export class NotificacionesTarjetaPage implements OnInit {
  private readonly servicio = inject(NotificacionService);

  readonly tarjetas = ['tarjeta-0001', 'tarjeta-0002'];
  readonly tarjetaId = signal(this.tarjetas[0]);
  readonly soloNoLeidas = signal(false);
  readonly items = signal<Notificacion[]>([]);
  readonly total = signal(0);
  readonly estado = signal<Estado>('cargando');

  ngOnInit(): void {
    this.cargar();
  }

  cambiarTarjeta(id: string): void {
    this.tarjetaId.set(id);
    this.cargar();
  }

  cambiarFiltro(soloNoLeidas: boolean): void {
    this.soloNoLeidas.set(soloNoLeidas);
    this.cargar();
  }

  cargar(): void {
    this.estado.set('cargando');
    const leida = this.soloNoLeidas() ? false : undefined;
    this.servicio.listar(this.tarjetaId(), { leida, page: 0, size: 50 }).subscribe({
      next: (pagina) => {
        this.items.set(pagina.items);
        this.total.set(pagina.total);
        this.estado.set('listo');
      },
      error: () => this.estado.set('error'),
    });
  }

  marcarLeida(id: number): void {
    this.servicio.marcarLeida(id).subscribe({
      next: () => this.cargar(),
      error: () => this.estado.set('error'),
    });
  }
}
