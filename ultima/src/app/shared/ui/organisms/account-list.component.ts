import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { Account } from '../../../core/accounts/account.model';
import { AccountCardComponent } from '../molecules/account-card.component';

@Component({
  selector: 'app-account-list',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [AccountCardComponent],
  template: `
    @if (accounts().length === 0) {
      <p class="empty">No se encontraron cuentas.</p>
    } @else {
      <ul class="list">
        @for (a of accounts(); track a.id) {
          <li><app-account-card [account]="a" (selected)="selected.emit($event)" /></li>
        }
      </ul>
    }
  `,
  styles: `
    .list { list-style: none; margin: 0; padding: 0; display: grid; gap: var(--space-3); }
    .empty { color: var(--color-muted); text-align: center; padding: var(--space-4); }
  `,
})
export class AccountListComponent {
  readonly accounts = input.required<readonly Account[]>();
  readonly selected = output<string>();
}
