import { Component, computed, input } from '@angular/core';
import { EstadoPago } from '../pago.model';

const TEXTOS: Record<EstadoPago, string> = {
  PENDIENTE: 'Pendiente',
  CONFIRMADO: 'Confirmado',
  RECHAZADO: 'Rechazado',
};

const COLORES: Record<EstadoPago, string> = {
  PENDIENTE: 'var(--warning)',
  CONFIRMADO: 'var(--success)',
  RECHAZADO: 'var(--danger)',
};

@Component({
  selector: 'app-etiqueta-estado',
  styles: `.badge { display: inline-block; padding: 0.125rem 0.625rem; border: 1px solid currentColor;
    border-radius: 999px; font-weight: 600; font-size: 0.875rem; }`,
  template: `<span class="badge" [style.color]="color()">{{ texto() }}</span>`,
})
export class EtiquetaEstadoComponent {
  readonly estado = input.required<EstadoPago>();
  readonly texto = computed(() => TEXTOS[this.estado()]);
  readonly color = computed(() => COLORES[this.estado()]);
}
