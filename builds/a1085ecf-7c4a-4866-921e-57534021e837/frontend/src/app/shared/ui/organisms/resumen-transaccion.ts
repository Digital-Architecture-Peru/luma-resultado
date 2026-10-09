import { CurrencyPipe, DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { ResultadoTransaccion } from '../../../features/transaccion-tarjeta/models/transaccion.model';

/** Organism: resumen del resultado, anunciado con role=status. */
@Component({
  selector: 'app-resumen-transaccion',
  imports: [CurrencyPipe, DatePipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section role="status" aria-live="polite">
      @if (resultado(); as r) {
        <h2>
          Transacción {{ r.transaccion.estado === 'APROBADA' ? 'aprobada' : 'rechazada' }}
          @if (r.repetida) { <small>(solicitud ya registrada)</small> }
        </h2>
        <p>
          {{ r.transaccion.monto | currency: r.transaccion.moneda }} ·
          {{ r.transaccion.creadoEn | date: 'medium' }}
        </p>
      }
    </section>
  `,
})
export class ResumenTransaccion {
  readonly resultado = input<ResultadoTransaccion | null>(null);
}
