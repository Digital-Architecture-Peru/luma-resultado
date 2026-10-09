import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { PaymentStatus, STATUS_LABELS } from '../domain/payment.model';

/** Átomo: estado del pago con texto (no solo color). */
@Component({
  selector: 'app-status-badge',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<span class="badge" [class]="'badge-' + status().toLowerCase()">{{ label() }}</span>`,
})
export class StatusBadgeComponent {
  readonly status = input.required<PaymentStatus>();
  protected readonly label = computed(() => STATUS_LABELS[this.status()]);
}
