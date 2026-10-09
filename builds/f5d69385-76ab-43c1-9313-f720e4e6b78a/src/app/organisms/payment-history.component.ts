import { CurrencyPipe, DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { BadgeComponent } from '../atoms/badge.component';
import { Payment } from '../core/payment.model';

/** Organismo: historial de pagos de la sesión. */
@Component({
  selector: 'app-payment-history',
  standalone: true,
  imports: [BadgeComponent, CurrencyPipe, DatePipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="card" aria-labelledby="history-title">
      <h2 id="history-title">Pagos realizados</h2>
      @if (payments.length === 0) {
        <p class="muted">Aún no has realizado pagos.</p>
      } @else {
        <table>
          <thead>
            <tr><th>Referencia</th><th>Beneficiario</th><th class="num">Monto</th><th>Fecha</th><th>Estado</th></tr>
          </thead>
          <tbody>
            @for (p of payments; track p.id) {
              <tr>
                <td>{{ p.id }}</td>
                <td>{{ p.beneficiary }}</td>
                <td class="num">{{ p.amount | currency: 'USD' }}</td>
                <td>{{ p.createdAt | date: 'short' }}</td>
                <td><app-badge tone="ok">Completado</app-badge></td>
              </tr>
            }
          </tbody>
        </table>
      }
    </section>
  `,
})
export class PaymentHistoryComponent {
  @Input() payments: readonly Payment[] = [];
}
