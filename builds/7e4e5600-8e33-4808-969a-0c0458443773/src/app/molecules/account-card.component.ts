import { CurrencyPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { Account } from '../core/models/account.model';

/** Molécula: resumen de una cuenta. */
@Component({
  selector: 'app-account-card',
  standalone: true,
  imports: [CurrencyPipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <article class="card">
      <h3>{{ account().alias }}</h3>
      <p class="muted">{{ account().number }}</p>
      <p class="amount">{{ account().balance | currency: account().currency : 'S/ ' }}</p>
    </article>
  `,
})
export class AccountCardComponent {
  readonly account = input.required<Account>();
}
