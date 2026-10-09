import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { EstadoPago } from '../../../features/pagos/models/pago.model';

const ETIQUETAS: Record<EstadoPago, string> = {
  PENDIENTE: 'Pendiente',
  PROCESADO: 'Procesado',
  RECHAZADO: 'Rechazado',
};

/** Átomo: muestra el estado con texto (no solo color). */
@Component({
  selector: 'app-badge-estado',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<span class="badge" [class]="'badge ' + estado.toLowerCase()">{{ etiqueta }}</span>`,
  styles: [`
    .badge { display: inline-block; padding: 2px 10px; border-radius: 999px; font-size: 0.85rem;
      border: 1px solid currentColor; font-weight: 600; }
    .pendiente { color: var(--warning); }
    .procesado { color: var(--success); }
    .rechazado { color: var(--danger); }
  `],
})
export class BadgeEstadoComponent {
  @Input({ required: true }) estado!: EstadoPago;

  get etiqueta(): string {
    return ETIQUETAS[this.estado];
  }
}
