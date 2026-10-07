import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { Movement } from '../../../core/cards/models/movement.model';
import { Amount } from '../atoms/amount';

@Component({
  selector: 'tr[app-movement-row]',
  imports: [Amount],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <td>{{ movement().date }}</td>
    <td>{{ movement().description }}</td>
    <td class="num"><app-amount [value]="movement().amount" [currency]="movement().currency" /></td>
  `,
  styles: `.num { text-align: end; }`,
})
export class MovementRow {
  readonly movement = input.required<Movement>();
}
