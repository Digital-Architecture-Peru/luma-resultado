import { ChangeDetectionStrategy, Component, OnInit, computed, inject, signal } from '@angular/core';
import { Account, AccountTypeFilter } from '../core/account.model';
import { AccountRepository } from '../core/account.repository';
import { filterAccounts, totalsByCurrency } from '../core/account-query';
import { AccountListComponent, LoadState } from '../organisms/account-list.component';
import { AccountSummaryComponent } from '../organisms/account-summary.component';
import { SearchFieldComponent } from '../molecules/search-field.component';

/** Página: orquesta repositorio, filtros y organismos. */
@Component({
  selector: 'app-accounts-page',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [SearchFieldComponent, AccountSummaryComponent, AccountListComponent],
  template: `
    <h1>Consulta de cuentas</h1>
    @if (state() === 'success') {
      <app-account-summary [totals]="totals()" />
    }
    <app-search-field
      [query]="query()"
      [type]="type()"
      (queryChange)="query.set($event)"
      (typeChange)="type.set($event)"
    />
    @if (state() === 'success') {
      <p class="meta" role="status">{{ visible().length }} de {{ accounts().length }} cuentas</p>
    }
    <app-account-list [accounts]="visible()" [state]="state()" (retry)="load()" />
  `,
})
export class AccountsPageComponent implements OnInit {
  private readonly repository = inject(AccountRepository);

  readonly accounts = signal<readonly Account[]>([]);
  readonly state = signal<LoadState>('loading');
  readonly query = signal('');
  readonly type = signal<AccountTypeFilter>('TODAS');

  readonly visible = computed(() => filterAccounts(this.accounts(), this.query(), this.type()));
  readonly totals = computed(() => totalsByCurrency(this.accounts()));

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.state.set('loading');
    this.repository.list().subscribe({
      next: (accounts) => {
        this.accounts.set(accounts);
        this.state.set('success');
      },
      error: () => this.state.set('error'),
    });
  }
}
