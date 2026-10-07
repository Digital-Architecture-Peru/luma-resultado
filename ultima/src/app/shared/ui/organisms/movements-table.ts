import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { Movement } from '../../../core/cards/models/movement.model';
import { MovementRow } from '../molecules/movement-row';

@Component({
  selector: 'app-movements-table',
  imports: [MovementRow],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (movements().length === 0) {
      <p class="empty">No hay movimientos para esta tarjeta.</p>
    } @else {
      <table>
        <caption>Últimos movimientos</caption>
        <thead>
          <tr><th scope="col">Fecha</th><th scope="col">Descripción</th><th scope="col" class="num">Importe</th></tr>
        </thead>
        <tbody>
          @for (movement of movements(); track movement.id) {
            <tr app-movement-row [movement]="movement"></tr>
          }
        </tbody>
      </table>
    }
  `,
  styles: `
    table { width: 100%; border-collapse: collapse; }
    caption { text-align: start; font-weight: 600; padding-block: 0.5rem; }
    th, :host ::ng-deep td { padding: 0.5rem; border-bottom: 1px solid var(--border); text-align: start; }
    .num { text-align: end; }
    .empty { color: var(--muted); }
  `,
})
export class MovementsTable {
  readonly movements = input.required<readonly Movement[]>();
}
