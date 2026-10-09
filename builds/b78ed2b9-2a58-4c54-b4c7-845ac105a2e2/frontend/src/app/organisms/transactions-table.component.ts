import { CurrencyPipe, DatePipe } from '@angular/common';
import { Component, Input } from '@angular/core';
import { CardTransaction } from '../core/models';

@Component({
  selector: 'app-transactions-table',
  standalone: true,
  imports: [CurrencyPipe, DatePipe],
  template: `
    <section class="card">
      <h2>Movimientos</h2>
      @if (transactions.length === 0) {
        <p class="muted">Aún no hay movimientos.</p>
      } @else {
        <table>
          <thead>
            <tr><th>Fecha</th><th>Tipo</th><th>Estado</th><th class="num">Monto</th></tr>
          </thead>
          <tbody>
            @for (t of transactions; track t.id) {
              <tr>
                <td>{{ t.createdAt | date: 'medium' }}</td>
                <td>{{ t.type === 'PAYMENT' ? 'Pago' : t.type }}</td>
                <td>{{ t.status === 'APPROVED' ? 'Aprobado' : 'Rechazado' }}</td>
                <td class="num">{{ t.amount | currency: t.currency }}</td>
              </tr>
            }
          </tbody>
        </table>
      }
    </section>
  `,
})
export class TransactionsTableComponent {
  @Input() transactions: CardTransaction[] = [];
}
