import { Component, Input } from '@angular/core';
import { PaymentStatus } from '../models/payment.models';

const LABELS: Record<PaymentStatus, string> = {
  PENDING: 'Pendiente',
  COMPLETED: 'Completado',
  REJECTED: 'Rechazado',
};

@Component({
  selector: 'app-status-badge',
  standalone: true,
  template: `<span class="badge" [class]="status.toLowerCase()">{{ text }}</span>`,
  styles: [
    `
      .badge {
        display: inline-block;
        padding: var(--space-1) var(--space-3);
        border: 1px solid currentColor;
        border-radius: 999px;
        font-size: 0.875rem;
        font-weight: 600;
      }
      .completed {
        color: var(--success);
      }
      .rejected {
        color: var(--danger);
      }
      .pending {
        color: var(--warning);
      }
    `,
  ],
})
export class StatusBadgeComponent {
  @Input({ required: true }) status: PaymentStatus = 'PENDING';

  get text(): string {
    return LABELS[this.status];
  }
}
