import { CurrencyPipe, DatePipe } from '@angular/common';
import { Component, input } from '@angular/core';
import { Pago } from '../domain/pago.model';
import { StatusBadgeComponent } from '../atoms/status-badge.component';

/** Organismo: tabla de pagos con estado vacío. */
@Component({
  selector: 'app-pagos-table',
  standalone: true,
  imports: [CurrencyPipe, DatePipe, StatusBadgeComponent],
  template: `
    @if (pagos().length === 0) {
      <p class="empty">No se encontraron pagos con los filtros indicados.</p>
    } @else {
      <div class="table-wrap">
        <table>
          <caption class="sr-only">Listado de pagos</caption>
          <thead>
            <tr>
              <th scope="col">Fecha</th>
              <th scope="col">Beneficiario</th>
              <th scope="col">Concepto</th>
              <th scope="col">Referencia</th>
              <th scope="col" class="num">Monto</th>
              <th scope="col">Estado</th>
            </tr>
          </thead>
          <tbody>
            @for (p of pagos(); track p.id) {
              <tr>
                <td>{{ p.fecha | date: 'dd/MM/yyyy' }}</td>
                <td>{{ p.beneficiario }}</td>
                <td>{{ p.concepto }}</td>
                <td>{{ p.referencia }}</td>
                <td class="num">{{ p.monto | currency: p.moneda : 'symbol' : '1.2-2' }}</td>
                <td><app-status-badge [estado]="p.estado" /></td>
              </tr>
            }
          </tbody>
        </table>
      </div>
    }
  `,
})
export class PagosTableComponent {
  readonly pagos = input.required<readonly Pago[]>();
}
