import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { Account } from '../core/models/account.model';
import { AccountCardComponent } from '../molecules/account-card.component';

/** Organismo: listado de cuentas con saldo. */
@Component({
  selector: 'app-account-list',
  standalone: true,
  imports: [AccountCardComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section aria-labelledby="accounts-title">
      <h2 id="accounts-title">Mis cuentas</h2>
      @if (accounts().length === 0) {
        <p class="muted">No hay cuentas disponibles.</p>
      } @else {
        <div class="grid">
          @for (account of accounts(); track account.id) {
            <app-account-card [account]="account" />
          }
        </div>
      }
    </section>
  `,
})
export class AccountListComponent {
  readonly accounts = input.required<readonly Account[]>();
}
