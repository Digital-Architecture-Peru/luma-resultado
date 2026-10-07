import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { Tarjeta } from '../../../domain/tarjeta.model';
import { MaskPanPipe } from '../../../pipes/mask-pan.pipe';
import { BadgeEstadoComponent } from '../../atoms/badge-estado/badge-estado.component';
import { MontoComponent } from '../../atoms/monto/monto.component';

@Component({
  selector: 'app-tarjeta-resumen',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MaskPanPipe, BadgeEstadoComponent, MontoComponent],
  template: `
    <button type="button" class="card" (click)="seleccionar.emit(tarjeta)">
      <span class="head">
        <strong class="alias">{{ tarjeta.alias }}</strong>
        <app-badge-estado [estado]="tarjeta.estado" />
      </span>
      <span class="pan">{{ tarjeta.numero | maskPan }}</span>
      <span class="tipo">{{ tarjeta.tipo === 'CREDITO' ? 'Crédito' : 'Débito' }}</span>
      <span class="fila">
        Saldo <app-monto [valor]="tarjeta.saldo" [moneda]="tarjeta.moneda" />
      </span>
      @if (tarjeta.tipo === 'CREDITO') {
        <span class="fila">
          Límite <app-monto [valor]="tarjeta.limite" [moneda]="tarjeta.moneda" />
        </span>
      }
    </button>
  `,
  styles: [
    `
      .card {
        display: flex;
        flex-direction: column;
        gap: var(--space-2);
        width: 100%;
        text-align: start;
        padding: var(--space-4);
        background: var(--surface);
        color: var(--text);
        border: 1px solid var(--border);
        border-radius: var(--radius);
        box-shadow: var(--shadow);
        cursor: pointer;
      }
      .head, .fila { display: flex; justify-content: space-between; align-items: center; gap: var(--space-2); }
      .pan { letter-spacing: 0.08em; font-variant-numeric: tabular-nums; }
      .tipo { color: var(--muted); font-size: 0.875rem; }
    `,
  ],
})
export class TarjetaResumenComponent {
  @Input({ required: true }) tarjeta!: Tarjeta;
  @Output() readonly seleccionar = new EventEmitter<Tarjeta>();
}
