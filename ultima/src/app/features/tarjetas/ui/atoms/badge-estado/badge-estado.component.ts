import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { EstadoTarjeta } from '../../../domain/tarjeta.model';

const ETIQUETAS: Record<EstadoTarjeta, string> = {
  ACTIVA: 'Activa',
  BLOQUEADA: 'Bloqueada',
  VENCIDA: 'Vencida',
};

@Component({
  selector: 'app-badge-estado',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<span class="badge" [class]="estado.toLowerCase()">{{ etiqueta }}</span>`,
  styles: [
    `
      .badge {
        display: inline-block;
        padding: 0.125rem 0.625rem;
        border-radius: 999px;
        font-size: 0.8125rem;
        font-weight: 600;
      }
      .activa { background: var(--success-bg); color: var(--success-fg); }
      .bloqueada { background: var(--danger-bg); color: var(--danger-fg); }
      .vencida { background: var(--warn-bg); color: var(--warn-fg); }
    `,
  ],
})
export class BadgeEstadoComponent {
  @Input({ required: true }) estado!: EstadoTarjeta;

  get etiqueta(): string {
    return ETIQUETAS[this.estado];
  }
}
