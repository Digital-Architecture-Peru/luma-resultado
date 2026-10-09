import { DatePipe, DecimalPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { Comprobante } from '../../../features/transferencias/data-access/models';

/** Organismo: comprobante de una transferencia completada (anunciado con role=status). */
@Component({
  selector: 'app-comprobante',
  imports: [DatePipe, DecimalPipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="card" role="status" aria-live="polite" aria-label="Comprobante de transferencia">
      <h2>Transferencia {{ comprobante().estado.toLowerCase() }}</h2>
      <dl>
        <dt>Comprobante</dt><dd>{{ comprobante().id }}</dd>
        <dt>Monto</dt><dd>{{ comprobante().monto | number: '1.2-2' }} {{ comprobante().moneda }}</dd>
        <dt>Saldo de origen</dt><dd>{{ comprobante().saldoOrigen | number: '1.2-2' }} {{ comprobante().moneda }}</dd>
        <dt>Fecha</dt><dd>{{ comprobante().creadoEn | date: 'medium' }}</dd>
      </dl>
    </section>
  `,
})
export class ComprobanteComponent {
  readonly comprobante = input.required<Comprobante>();
}
