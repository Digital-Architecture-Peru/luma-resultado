import { DatePipe } from '@angular/common';
import { Component, Input } from '@angular/core';
import { Movement } from '../core/models';

@Component({
  selector: 'app-movements-table',
  standalone: true,
  imports: [DatePipe],
  template: `
    @if (movements.length === 0) {
      <p class="muted">Sin movimientos para esta cuenta.</p>
    } @else {
      <table class="table">
        <caption>Últimos movimientos</caption>
        <thead>
          <tr><th scope="col">Fecha</th><th scope="col">Tipo</th><th scope="col" class="num">Monto</th></tr>
        </thead>
        <tbody>
          @for (m of movements; track m.id) {
            <tr>
              <td>{{ m.createdAt | date: 'short' }}</td>
              <td>{{ m.type === 'DEBIT' ? 'Débito' : 'Crédito' }}</td>
              <td class="num">{{ m.type === 'DEBIT' ? '−' : '+' }}{{ m.amount }}</td>
            </tr>
          }
        </tbody>
      </table>
    }
  `,
})
export class MovementsTableComponent {
  @Input() movements: Movement[] = [];
}
