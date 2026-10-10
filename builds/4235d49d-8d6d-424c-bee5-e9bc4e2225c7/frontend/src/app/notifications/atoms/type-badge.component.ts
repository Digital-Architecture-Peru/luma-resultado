import { Component, Input } from '@angular/core';
import { NotificationType } from '../models/notification.model';

const LABELS: Record<NotificationType, string> = {
  DEPOSIT: 'Depósito',
  WITHDRAWAL: 'Retiro',
  LOW_BALANCE: 'Saldo bajo',
};

/** Átomo: etiqueta de tipo de notificación (texto + color, no solo color). */
@Component({
  selector: 'app-type-badge',
  standalone: true,
  template: `<span class="badge" [class]="'badge ' + type">{{ label }}</span>`,
  styles: [`
    .badge { display: inline-block; padding: 2px var(--space-2); border-radius: 999px;
      font-size: 0.8rem; font-weight: 600; border: 1px solid currentColor; }
    .DEPOSIT { color: var(--success); }
    .WITHDRAWAL { color: var(--primary); }
    .LOW_BALANCE { color: var(--warning); }
  `],
})
export class TypeBadgeComponent {
  @Input({ required: true }) type!: NotificationType;

  get label(): string {
    return LABELS[this.type];
  }
}
