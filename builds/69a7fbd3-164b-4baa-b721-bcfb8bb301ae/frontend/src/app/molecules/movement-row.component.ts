import { DatePipe } from '@angular/common';
import { Component, Input } from '@angular/core';
import { Movement } from '../core/models';
import { MoneyComponent } from '../atoms/money.component';

@Component({
  selector: 'tr[app-movement-row]',
  standalone: true,
  imports: [DatePipe, MoneyComponent],
  template: `
    <td>{{ movement.postedAt | date: 'dd/MM/yyyy HH:mm' }}</td>
    <td>{{ movement.description }}</td>
    <td class="num"><app-money [amount]="movement.amount" [currency]="movement.currency" /></td>
  `,
})
export class MovementRowComponent {
  @Input({ required: true }) movement!: Movement;
}
