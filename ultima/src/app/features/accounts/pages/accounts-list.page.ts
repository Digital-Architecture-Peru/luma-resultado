import { ChangeDetectionStrategy, Component, DestroyRef, OnInit, computed, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';
import { Account, AccountType } from '../../../core/accounts/account.model';
import { ACCOUNTS_QUERY } from '../../../core/accounts/accounts-query.port';
import { SearchFieldComponent } from '../../../shared/ui/molecules/search-field.component';
import { AccountListComponent } from '../../../shared/ui/organisms/account-list.component';
import { MobileListDetailTemplate } from '../templates/mobile-list-detail.template';

type TypeFilter = AccountType | 'todas';

@Component({
  selector: 'app-accounts-list-page',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MobileListDetailTemplate, SearchFieldComponent, AccountListComponent],
  template: `
    <app-mobile-list-detail-template heading="Mis cuentas">
      <app-search-field label="Buscar cuenta por alias" placeholder="Buscar por alias" [value]="query()" (valueChange)="query.set($event)" />

      <div class="chips" role="group" aria-label="Filtrar por tipo de cuenta">
        @for (opt of options; track opt.value) {
          <button type="button" class="chip" [attr.aria-pressed]="type() === opt.value" (click)="setType(opt.value)">
            {{ opt.label }}
          </button>
        }
      </div>

      @if (loading()) {
        <p role="status">Cargando cuentas…</p>
      } @else if (error()) {
        <p role="alert" class="error">{{ error() }}</p>
        <button type="button" class="chip" (click)="load()">Reintentar</button>
      } @else {
        <p class="sr-only" role="status">{{ visible().length }} cuentas encontradas</p>
        <app-account-list [accounts]="visible()" (selected)="open($event)" />
      }
    </app-mobile-list-detail-template>
  `,
  styles: `
    .chips { display: flex; gap: var(--space-2); flex-wrap: wrap; }
    .chip { min-height: var(--tap); padding: 0 var(--space-3); font: inherit; border-radius: 999px; cursor: pointer;
      border: 1px solid var(--color-primary); background: var(--color-surface); color: var(--color-primary); }
    .chip[aria-pressed='true'] { background: var(--color-primary); color: var(--color-primary-contrast); }
    .error { color: var(--color-error); }
  `,
})
export class AccountsListPage implements OnInit {
  private readonly port = inject(ACCOUNTS_QUERY);
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);

  readonly options: readonly { value: TypeFilter; label: string }[] = [
    { value: 'todas', label: 'Todas' },
    { value: 'ahorros', label: 'Ahorros' },
    { value: 'corriente', label: 'Corriente' },
  ];

  readonly accounts = signal<Account[]>([]);
  readonly loading = signal(true);
  readonly error = signal<string | null>(null);
  readonly type = signal<TypeFilter>('todas');
  readonly query = signal('');

  readonly visible = computed(() => {
    const q = this.query().trim().toLowerCase();
    return q ? this.accounts().filter((a) => a.alias.toLowerCase().includes(q)) : this.accounts();
  });

  ngOnInit(): void {
    this.load();
  }

  setType(value: TypeFilter): void {
    this.type.set(value);
    this.load();
  }

  load(): void {
    this.loading.set(true);
    this.error.set(null);
    const t = this.type();
    this.port
      .list(t === 'todas' ? undefined : { type: t })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (items) => {
          this.accounts.set(items);
          this.loading.set(false);
        },
        error: () => {
          this.error.set('No se pudieron cargar las cuentas.');
          this.loading.set(false);
        },
      });
  }

  open(id: string): void {
    void this.router.navigate(['/cuentas', id]);
  }
}
