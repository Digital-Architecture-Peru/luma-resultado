import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { Account } from '../core/account.model';
import { MoneyPipe } from '../atoms/money.pipe';
import { StatusBadgeComponent } from '../atoms/status-badge.component';

/** Molécula: tarjeta de una cuenta (alias, número enmascarado, saldos, estado). */
@Component({
  selector: 'app-account-card',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MoneyPipe, StatusBadgeComponent],
  template: `
    <article class="card" [attr.aria-label]="'Cuenta ' + account.alias">
      <header>
        <h3>{{ account.alias }}</h3>
        <app-status-badge [status]="account.status" />
      </header>
      <p class="meta">{{ account.type }} · {{ account.maskedNumber }} · {{ account.currency }}</p>
      <dl>
        <div>
          <dt>Saldo contable</dt>
          <dd class="amount">{{ account.balance | money: account.currency }}</dd>
        </div>
        <div>
          <dt>Saldo disponible</dt>
          <dd class="amount">{{ account.available | money: account.currency }}</dd>
        </div>
      </dl>
    </article>
  `,
})
export class AccountCardComponent {
  @Input({ required: true }) account!: Account;
}
