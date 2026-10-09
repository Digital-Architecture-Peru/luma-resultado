import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { AccountStatus } from '../core/account.model';

const LABELS: Record<AccountStatus, string> = {
  ACTIVA: 'Activa',
  BLOQUEADA: 'Bloqueada',
  INACTIVA: 'Inactiva',
};

/** Átomo: estado con texto además de color. */
@Component({
  selector: 'app-status-badge',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<span class="badge" [attr.data-status]="status">{{ label }}</span>`,
})
export class StatusBadgeComponent {
  @Input({ required: true }) status!: AccountStatus;

  get label(): string {
    return LABELS[this.status];
  }
}
