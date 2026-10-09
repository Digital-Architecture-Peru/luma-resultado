import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { StatusBadgeComponent } from '../atoms/status-badge.component';
import { MoneyPipe } from '../atoms/money.pipe';
import { Card } from '../domain/models';

/** Molécula: tarjeta seleccionable con su deuda y estado. */
@Component({
  selector: 'app-card-item',
  standalone: true,
  imports: [StatusBadgeComponent, MoneyPipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <button
      type="button"
      class="card-item"
      [class.is-selected]="selected()"
      [disabled]="card().status === 'blocked'"
      [attr.aria-pressed]="selected()"
      (click)="picked.emit(card().id)"
    >
      <span class="card-item__title">{{ card().alias }} · {{ card().maskedNumber }}</span>
      <span class="card-item__debt">Deuda: {{ card().balance | money }}</span>
      <span class="card-item__min">Pago mínimo: {{ card().minimumPayment | money }}</span>
      <app-status-badge [tone]="card().status === 'active' ? 'success' : 'danger'">
        {{ card().status === 'active' ? 'Activa' : 'Bloqueada' }}
      </app-status-badge>
    </button>
  `,
})
export class CardItemComponent {
  readonly card = input.required<Card>();
  readonly selected = input(false);
  readonly picked = output<string>();
}
