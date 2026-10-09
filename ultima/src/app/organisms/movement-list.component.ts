import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { Account, Movement } from '../core/models/account.model';
import { MovementItemComponent } from '../molecules/movement-item.component';

/** Organismo: historial de transferencias de la sesión. */
@Component({
  selector: 'app-movement-list',
  standalone: true,
  imports: [MovementItemComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section aria-labelledby="movements-title">
      <h2 id="movements-title">Transferencias recientes</h2>
      @if (movements().length === 0) {
        <p class="muted">Aún no realizaste transferencias en esta sesión.</p>
      } @else {
        <ul class="movements">
          @for (movement of movements(); track movement.reference) {
            <app-movement-item
              [movement]="movement"
              [sourceLabel]="aliasOf(movement.sourceId)"
              [targetLabel]="aliasOf(movement.targetId)"
            />
          }
        </ul>
      }
    </section>
  `,
})
export class MovementListComponent {
  readonly movements = input.required<readonly Movement[]>();
  readonly accounts = input.required<readonly Account[]>();

  private readonly aliases = computed(() => new Map(this.accounts().map((a) => [a.id, a.alias])));

  aliasOf(id: string): string {
    return this.aliases().get(id) ?? id;
  }
}
