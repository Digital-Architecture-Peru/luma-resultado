import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { EstadoCuenta } from '../data/account.model';

const ETIQUETAS: Record<EstadoCuenta, string> = {
  ACTIVA: 'Activa',
  BLOQUEADA: 'Bloqueada',
  CERRADA: 'Cerrada'
};

export function etiquetaEstado(estado: EstadoCuenta): string {
  return ETIQUETAS[estado];
}

@Component({
  selector: 'app-badge-estado',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<span class="badge" [class]="'badge ' + estado.toLowerCase()">{{ etiqueta }}</span>`,
  styles: [
    `
      .badge { padding: 0.125rem 0.625rem; border-radius: 999px; font-size: 0.8125rem; border: 1px solid currentColor; }
      .activa { color: var(--success); }
      .bloqueada { color: var(--warning); }
      .cerrada { color: var(--muted); }
    `
  ]
})
export class BadgeEstadoComponent {
  @Input({ required: true }) estado: EstadoCuenta = 'ACTIVA';

  get etiqueta(): string {
    return etiquetaEstado(this.estado);
  }
}
