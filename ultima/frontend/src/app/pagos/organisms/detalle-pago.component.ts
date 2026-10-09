import { Component, input } from '@angular/core';
import { EtiquetaEstadoComponent } from '../atoms/etiqueta-estado.component';
import { ResumenImporteComponent } from '../molecules/resumen-importe.component';
import { Pago } from '../pago.model';

@Component({
  selector: 'app-detalle-pago',
  imports: [EtiquetaEstadoComponent, ResumenImporteComponent],
  template: `
    <section aria-label="Detalle del pago">
      <app-resumen-importe [monto]="pago().monto" [moneda]="pago().moneda" />
      <p>Estado: <app-etiqueta-estado [estado]="pago().estado" /></p>
      <dl>
        <dt>Cuenta de origen</dt><dd>{{ pago().cuentaOrigen }}</dd>
        <dt>Cuenta de destino</dt><dd>{{ pago().cuentaDestino }}</dd>
        <dt>Referencia</dt><dd>{{ pago().id }}</dd>
      </dl>
    </section>
  `,
})
export class DetallePagoComponent {
  readonly pago = input.required<Pago>();
}
