import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { statusLabel } from '../domain/card-format';
import { CardStatus } from '../domain/card.model';

const ICONS: Record<CardStatus, string> = { active: '✔', blocked: '⛔', expired: '⌛' };

@Component({
  selector: 'app-status-badge',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<span class="badge" [class]="'badge badge--' + status"
    ><span aria-hidden="true">{{ icon }}</span> {{ label }}</span
  >`,
})
export class StatusBadgeComponent {
  @Input({ required: true }) status!: CardStatus;

  get label(): string {
    return statusLabel(this.status);
  }

  get icon(): string {
    return ICONS[this.status];
  }
}
