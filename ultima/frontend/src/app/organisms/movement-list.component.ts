import { DatePipe, DecimalPipe } from '@angular/common';
import { Component, Input } from '@angular/core';
import { AppBadgeComponent } from '../atoms/app-badge.component';
import { Movement } from '../core/models';

@Component({
  selector: 'app-movement-list',
  standalone: true,
  imports: [DatePipe, DecimalPipe, AppBadgeComponent],
  template: `@if (movements.length === 0) {
    <p class="muted">Sin movimientos para esta cuenta.</p>
  } @else {
    <table class="table">
      <caption class="sr-only">Movimientos de la cuenta</caption>
      <thead>
        <tr><th scope="col">Fecha</th><th scope="col">Tipo</th><th scope="col" class="num">Monto</th></tr>
      </thead>
      <tbody>
        @for (m of movements; track m.id) {
          <tr>
            <td>{{ m.createdAt | date: 'short' }}</td>
            <td>
              <app-badge [tone]="m.type === 'CREDIT' ? 'ok' : 'warn'">{{ m.type === 'CREDIT' ? 'Crédito' : 'Débito' }}</app-badge>
            </td>
            <td class="num">{{ m.amount | number: '1.2-2' }}</td>
          </tr>
        }
      </tbody>
    </table>
  }`,
})
export class MovementListComponent {
  @Input() movements: Movement[] = [];
}
