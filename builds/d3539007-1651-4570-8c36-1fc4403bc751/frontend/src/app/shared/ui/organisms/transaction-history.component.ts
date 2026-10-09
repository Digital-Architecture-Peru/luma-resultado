import { CurrencyPipe, DatePipe } from '@angular/common';
import { Component, Input } from '@angular/core';
import { TransactionItem } from '../../../features/card-transaction/models/card-transaction.models';

@Component({
  selector: 'app-transaction-history',
  standalone: true,
  imports: [CurrencyPipe, DatePipe],
  template: `
    @if (items.length === 0) {
      <p>Sin transacciones.</p>
    } @else {
      <table>
        <caption>Historial</caption>
        <thead><tr><th>Fecha</th><th>Descripcion</th><th>Estado</th><th class="num">Monto</th></tr></thead>
        <tbody>
          @for (t of items; track t.id) {
            <tr>
              <td>{{ t.createdAt | date: 'short' }}</td>
              <td>{{ t.description }}</td>
              <td>{{ t.status }}</td>
              <td class="num">{{ t.amount | currency: t.currency }}</td>
            </tr>
          }
        </tbody>
      </table>
    }
  `,
  styles: [`
    table { inline-size: 100%; border-collapse: collapse; }
    th, td { padding: var(--space-2); border-bottom: 1px solid var(--border); text-align: start; }
    .num { text-align: end; font-variant-numeric: tabular-nums; }
  `],
})
export class TransactionHistoryComponent {
  @Input() items: TransactionItem[] = [];
}
