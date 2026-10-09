import { CurrencyPipe, DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { Movement } from '../core/models/account.model';
import { UiBadgeComponent } from '../atoms/ui-badge.component';

/** Molécula: fila de un movimiento realizado. */
@Component({
  selector: 'app-movement-item',
  standalone: true,
  imports: [CurrencyPipe, DatePipe, UiBadgeComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <li class="movement">
      <div>
        <strong>{{ sourceLabel() }} → {{ targetLabel() }}</strong>
        <p class="muted">
          {{ movement().date | date: 'dd/MM/yyyy HH:mm' }} · {{ movement().reference }}
          @if (movement().concept) { · {{ movement().concept }} }
        </p>
      </div>
      <div class="movement-end">
        <span class="amount">{{ movement().amount | currency: 'PEN' : 'S/ ' }}</span>
        <ui-badge tone="success">Ejecutada</ui-badge>
      </div>
    </li>
  `,
})
export class MovementItemComponent {
  readonly movement = input.required<Movement>();
  readonly sourceLabel = input.required<string>();
  readonly targetLabel = input.required<string>();
}
