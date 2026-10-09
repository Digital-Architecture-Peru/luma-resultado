import { Component, Input } from '@angular/core';
import { EstadoPago } from '../../core/pago.model';

/** Átomo: estado con texto (no solo color) y clase de tono. */
@Component({
  selector: 'app-estado-badge',
  standalone: true,
  template: `<span class="badge" [class]="tono">{{ estado }}</span>`,
  styles: [
    `
      .badge { display: inline-block; padding: 0 0.5rem; border-radius: 999px; border: 1px solid currentColor; font-size: 0.8rem; font-weight: 600; }
      .ok { color: var(--success); }
      .warn { color: var(--warning); }
      .error { color: var(--danger); }
      .neutral { color: var(--muted); }
    `,
  ],
})
export class EstadoBadgeComponent {
  @Input({ required: true }) estado!: EstadoPago;

  get tono(): string {
    switch (this.estado) {
      case 'PROCESADO':
        return 'badge ok';
      case 'PENDIENTE':
        return 'badge warn';
      case 'RECHAZADO':
        return 'badge error';
      default:
        return 'badge neutral';
    }
  }
}
