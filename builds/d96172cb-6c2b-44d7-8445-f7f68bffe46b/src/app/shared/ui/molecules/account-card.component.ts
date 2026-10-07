import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';
import { Account, AccountStatus } from '../../../core/accounts/account.model';
import { MaskAccountPipe } from '../../../core/accounts/mask-account.pipe';
import { AmountComponent } from '../atoms/amount.component';
import { BadgeComponent, BadgeTone } from '../atoms/badge.component';

const STATUS_LABEL: Record<AccountStatus, string> = {
  activa: 'Activa',
  bloqueada: 'Bloqueada',
  inactiva: 'Inactiva',
};
const STATUS_TONE: Record<AccountStatus, BadgeTone> = {
  activa: 'ok',
  bloqueada: 'warn',
  inactiva: 'neutral',
};

@Component({
  selector: 'app-account-card',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [AmountComponent, BadgeComponent, MaskAccountPipe],
  template: `
    <button type="button" class="card" (click)="selected.emit(account().id)">
      <span class="top">
        <strong class="alias">{{ account().alias }}</strong>
        <app-badge [label]="statusLabel()" [tone]="statusTone()" />
      </span>
      <span class="number">{{ account().type === 'ahorros' ? 'Ahorros' : 'Corriente' }} · {{ account().maskedNumber | maskAccount }}</span>
      <span class="balance">
        <span class="muted">Disponible</span>
        <app-amount [value]="account().availableBalance" [currency]="account().currency" />
      </span>
    </button>
  `,
  styles: `
    .card { display: flex; flex-direction: column; gap: var(--space-2); width: 100%; min-height: var(--tap);
      padding: var(--space-3); text-align: left; font: inherit; color: var(--color-text);
      background: var(--color-surface); border: 1px solid var(--color-border); border-radius: var(--radius); cursor: pointer; }
    .top, .balance { display: flex; justify-content: space-between; align-items: center; gap: var(--space-2); }
    .number, .muted { color: var(--color-muted); font-size: 0.9rem; }
  `,
})
export class AccountCardComponent {
  readonly account = input.required<Account>();
  readonly selected = output<string>();

  readonly statusLabel = computed(() => STATUS_LABEL[this.account().status]);
  readonly statusTone = computed(() => STATUS_TONE[this.account().status]);
}
