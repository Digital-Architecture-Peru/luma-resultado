import { ChangeDetectionStrategy, Component, DestroyRef, OnInit, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router } from '@angular/router';
import { switchMap, tap } from 'rxjs';
import { Account } from '../../../core/accounts/account.model';
import { ACCOUNTS_QUERY } from '../../../core/accounts/accounts-query.port';
import { MaskAccountPipe } from '../../../core/accounts/mask-account.pipe';
import { AmountComponent } from '../../../shared/ui/atoms/amount.component';
import { BadgeComponent } from '../../../shared/ui/atoms/badge.component';
import { MobileListDetailTemplate } from '../templates/mobile-list-detail.template';

@Component({
  selector: 'app-account-detail-page',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MobileListDetailTemplate, AmountComponent, BadgeComponent, MaskAccountPipe],
  template: `
    <app-mobile-list-detail-template heading="Detalle de cuenta" [showBack]="true" (back)="goBack()">
      @if (loading()) {
        <p role="status">Cargando…</p>
      } @else if (account(); as acc) {
        <section class="detail" [attr.aria-label]="acc.alias">
          <h2>{{ acc.alias }}</h2>
          <dl>
            <dt>Número</dt><dd>{{ acc.maskedNumber | maskAccount }}</dd>
            <dt>Tipo</dt><dd>{{ acc.type === 'ahorros' ? 'Ahorros' : 'Corriente' }}</dd>
            <dt>Estado</dt>
            <dd><app-badge [label]="acc.status" [tone]="acc.status === 'activa' ? 'ok' : acc.status === 'bloqueada' ? 'warn' : 'neutral'" /></dd>
            <dt>Saldo disponible</dt>
            <dd><app-amount [value]="acc.availableBalance" [currency]="acc.currency" /></dd>
          </dl>
        </section>
      } @else {
        <p role="alert">No se encontró la cuenta solicitada.</p>
      }
    </app-mobile-list-detail-template>
  `,
  styles: `
    .detail { background: var(--color-surface); border: 1px solid var(--color-border); border-radius: var(--radius); padding: var(--space-3); }
    h2 { margin: 0 0 var(--space-3); font-size: 1.2rem; }
    dl { display: grid; grid-template-columns: 1fr 1fr; gap: var(--space-2) var(--space-3); margin: 0; }
    dt { color: var(--color-muted); }
    dd { margin: 0; text-align: right; text-transform: capitalize; }
  `,
})
export class AccountDetailPage implements OnInit {
  private readonly port = inject(ACCOUNTS_QUERY);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);

  readonly account = signal<Account | undefined>(undefined);
  readonly loading = signal(true);

  ngOnInit(): void {
    this.route.paramMap
      .pipe(
        tap(() => this.loading.set(true)),
        switchMap((params) => this.port.getById(params.get('id') ?? '')),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe({
        next: (acc) => {
          this.account.set(acc);
          this.loading.set(false);
        },
        error: () => {
          this.account.set(undefined);
          this.loading.set(false);
        },
      });
  }

  goBack(): void {
    void this.router.navigate(['/cuentas']);
  }
}
