import { CurrencyPipe, DatePipe } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Notificacion } from '../data/models';
import { BadgeComponent } from '../atoms/badge.component';
import { BotonComponent } from '../atoms/boton.component';
import { IconoTipoComponent } from '../atoms/icono-tipo.component';

@Component({
  selector: 'app-item-notificacion',
  standalone: true,
  imports: [BadgeComponent, BotonComponent, IconoTipoComponent, CurrencyPipe, DatePipe],
  template: `
    <article class="item">
      <app-icono-tipo [tipo]="notificacion.tipo" />
      <div class="cuerpo">
        <h3>{{ notificacion.titulo }} <app-badge [nuevo]="!notificacion.leida" /></h3>
        <p>{{ notificacion.mensaje }}</p>
        <small>
          Tarjeta •••• {{ notificacion.ultimos4 }} · {{ notificacion.creadaEn | date: 'medium' }}
          @if (notificacion.monto !== null && notificacion.moneda) {
            · {{ notificacion.monto | currency: notificacion.moneda }}
          }
        </small>
      </div>
      @if (!notificacion.leida) {
        <app-boton etiqueta="Marcar como leída" (pulsado)="marcar.emit(notificacion.id)" />
      }
    </article>
  `,
  styles: [`
    .item { display: flex; gap: var(--space-3); align-items: center; padding: var(--space-4);
            background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius-md);
            box-shadow: var(--shadow-sm); }
    .cuerpo { flex: 1; }
    h3 { margin: 0; font-size: 1rem; }
    p { margin: var(--space-1) 0; }
    small { color: var(--muted); }
  `]
})
export class ItemNotificacionComponent {
  @Input({ required: true }) notificacion!: Notificacion;
  @Output() readonly marcar = new EventEmitter<string>();
}
