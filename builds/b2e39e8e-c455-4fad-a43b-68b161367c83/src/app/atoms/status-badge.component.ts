import { Component, computed, input } from '@angular/core';
import { ETIQUETA_ESTADO, EstadoPago } from '../domain/pago.model';

/** Átomo: estado del pago con texto (no solo color). */
@Component({
  selector: 'app-status-badge',
  standalone: true,
  template: `<span class="badge" [class]="'badge badge--' + estado().toLowerCase()">{{ etiqueta() }}</span>`,
})
export class StatusBadgeComponent {
  readonly estado = input.required<EstadoPago>();
  readonly etiqueta = computed(() => ETIQUETA_ESTADO[this.estado()]);
}
