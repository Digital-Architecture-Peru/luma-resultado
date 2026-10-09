import { Component, Input } from '@angular/core';
import { EstadoPago } from '../data/pago.model';

const ETIQUETAS: Record<EstadoPago, string> = {
  PENDIENTE: 'Pendiente',
  PROCESADO: 'Procesado',
  RECHAZADO: 'Rechazado',
  ANULADO: 'Anulado',
};

/** Atomo: el estado se comunica con texto, no solo con color. */
@Component({
  selector: 'app-estado-badge',
  standalone: true,
  template: `<span class="badge" [class]="'badge ' + estado.toLowerCase()">{{ etiqueta }}</span>`,
  styles: [
    `.badge { display: inline-block; padding: 0 0.5rem; border-radius: 999px; border: 1px solid currentColor; font-size: 0.85rem; }
     .procesado { color: var(--success); } .rechazado, .anulado { color: var(--danger); } .pendiente { color: var(--warning); }`,
  ],
})
export class EstadoBadgeComponent {
  @Input({ required: true }) estado!: EstadoPago;

  get etiqueta(): string {
    return ETIQUETAS[this.estado];
  }
}
