import { CurrencyPipe, DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { TRANSACTION_TYPE_LABELS, Transaction } from '../domain/card.model';

@Component({
  selector: 'app-transaction-history',
  imports: [CurrencyPipe, DatePipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="panel" aria-labelledby="history-title">
      <h2 id="history-title">Movimientos de la sesión</h2>
      @if (transactions().length === 0) {
        <p class="empty">Aún no hay movimientos para esta tarjeta.</p>
      } @else {
        <table>
          <thead>
            <tr>
              <th scope="col">Referencia</th>
              <th scope="col">Fecha</th>
              <th scope="col">Operación</th>
              <th scope="col">Descripción</th>
              <th scope="col" class="num">Monto</th>
            </tr>
          </thead>
          <tbody>
            @for (tx of transactions(); track tx.id) {
              <tr>
                <td>{{ tx.id }}</td>
                <td>{{ tx.createdAt | date: 'short' }}</td>
                <td>{{ labels[tx.type] }}</td>
                <td>{{ tx.description }}</td>
                <td class="num">{{ tx.amount | currency: currency() : 'symbol' : '1.2-2' }}</td>
              </tr>
            }
          </tbody>
        </table>
      }
    </section>
  `,
})
export class TransactionHistory {
  readonly transactions = input.required<Transaction[]>();
  readonly currency = input('PEN');
  protected readonly labels = TRANSACTION_TYPE_LABELS;
}
