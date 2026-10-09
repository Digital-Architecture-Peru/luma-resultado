import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { EstadoCuenta } from '../models/cuenta.model';

const ETIQUETAS: Record<EstadoCuenta, string> = {
  ACTIVA: 'Activa',
  BLOQUEADA: 'Bloqueada',
  CERRADA: 'Cerrada'
};

/** Atom: estado con texto (no solo color). */
@Component({
  selector: 'app-badge-estado',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<span class="badge" [class]="'badge ' + estado.toLowerCase()">{{ etiqueta }}</span>`,
  styles: [`
    .badge { display: inline-block; padding: 2px 10px; border-radius: 999px; font-size: .8rem;
      border: 1px solid currentColor; }
    .activa { color: var(--success); }
    .bloqueada { color: var(--warning); }
    .cerrada { color: var(--danger); }
  `]
})
export class BadgeEstadoComponent {
  @Input({ required: true }) estado: EstadoCuenta = 'ACTIVA';

  get etiqueta(): string {
    return ETIQUETAS[this.estado];
  }
}
