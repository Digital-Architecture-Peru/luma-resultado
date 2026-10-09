import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { StatusBadgeComponent } from '../atoms/status-badge.component';
import { Payment } from '../domain/payment.model';
import { formatAmount } from '../domain/payment.queries';

/** Organismo: tabla de pagos con estado vacío. */
@Component({
  selector: 'app-payment-table',
  imports: [StatusBadgeComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (payments().length === 0) {
      <p class="empty">No se encontraron pagos con los criterios indicados.</p>
    } @else {
      <div class="table-wrap">
        <table>
          <caption class="sr-only">Listado de pagos</caption>
          <thead>
            <tr>
              <th scope="col">Fecha</th>
              <th scope="col">Referencia</th>
              <th scope="col">Beneficiario</th>
              <th scope="col">Concepto</th>
              <th scope="col" class="num">Monto</th>
              <th scope="col">Estado</th>
            </tr>
          </thead>
          <tbody>
            @for (p of payments(); track p.id) {
              <tr>
                <td>{{ p.date }}</td>
                <td>{{ p.id }}</td>
                <td>{{ p.beneficiary }}</td>
                <td>{{ p.concept }}</td>
                <td class="num">{{ format(p) }}</td>
                <td><app-status-badge [status]="p.status" /></td>
              </tr>
            }
          </tbody>
        </table>
      </div>
    }
  `,
})
export class PaymentTableComponent {
  readonly payments = input.required<readonly Payment[]>();

  protected format(p: Payment): string {
    return formatAmount(p.amount, p.currency);
  }
}
