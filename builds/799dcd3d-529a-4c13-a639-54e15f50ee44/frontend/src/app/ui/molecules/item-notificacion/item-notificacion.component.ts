import { DatePipe } from '@angular/common';
import { Component, input, output } from '@angular/core';
import { enmascararTarjeta, Notificacion } from '../../../core/models/notificacion.model';
import { BadgeTipoComponent } from '../../atoms/badge-tipo/badge-tipo.component';
import { IconoEstadoComponent } from '../../atoms/icono-estado/icono-estado.component';

/** Molécula: una notificación con estado, tipo, mensaje y acción de marcar como leída. */
@Component({
  selector: 'app-item-notificacion',
  standalone: true,
  imports: [BadgeTipoComponent, IconoEstadoComponent, DatePipe],
  template: `
    <article class="item" [class.leida]="notificacion().leida">
      <app-icono-estado [leida]="notificacion().leida" />
      <div class="cuerpo">
        <div class="cabecera">
          <app-badge-tipo [tipo]="notificacion().tipo" />
          <span class="tarjeta">{{ tarjeta() }}</span>
          <time class="fecha" [attr.datetime]="notificacion().creadaEn">
            {{ notificacion().creadaEn | date: 'dd/MM/yyyy HH:mm' }}
          </time>
        </div>
        <p class="mensaje">{{ notificacion().mensaje }}</p>
      </div>
      @if (!notificacion().leida) {
        <button type="button" (click)="marcar.emit(notificacion().id)">Marcar como leída</button>
      }
    </article>
  `,
  styles: [
    `
      .item { display: flex; gap: 0.75rem; align-items: flex-start; padding: 0.75rem 1rem;
        border: 1px solid #d1d5db; border-radius: 8px; background: #fff; }
      .item.leida { background: #f9fafb; }
      .cuerpo { flex: 1; min-width: 0; }
      .cabecera { display: flex; flex-wrap: wrap; gap: 0.5rem; align-items: center; }
      .tarjeta, .fecha { font-size: 0.8rem; color: #4b5563; }
      .mensaje { margin: 0.25rem 0 0; }
      button { min-height: 40px; padding: 0 0.75rem; border-radius: 6px; border: 1px solid #1d4ed8;
        background: #fff; color: #1d4ed8; cursor: pointer; }
      button:focus-visible { outline: 3px solid #93c5fd; outline-offset: 2px; }
    `,
  ],
})
export class ItemNotificacionComponent {
  readonly notificacion = input.required<Notificacion>();
  readonly marcar = output<number>();

  tarjeta(): string {
    return enmascararTarjeta(this.notificacion().ultimos4);
  }
}
