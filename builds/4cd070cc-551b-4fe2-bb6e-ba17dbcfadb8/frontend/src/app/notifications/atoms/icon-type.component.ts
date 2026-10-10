import { Component, Input } from '@angular/core';
import { NotificationType } from '../data/models';

const LABELS: Record<NotificationType, string> = {
  DEPOSIT: 'Depósito',
  WITHDRAWAL: 'Retiro',
  LOW_BALANCE: 'Saldo bajo'
};

@Component({
  selector: 'app-icon-type',
  standalone: true,
  template: `<span class="type" [attr.data-type]="type">{{ text }}</span>`,
  styles: [`.type { font-size: 0.75rem; font-weight: 600; color: var(--muted); text-transform: uppercase; }`]
})
export class IconTypeComponent {
  @Input() type: NotificationType = 'DEPOSIT';

  get text(): string {
    return LABELS[this.type];
  }
}
