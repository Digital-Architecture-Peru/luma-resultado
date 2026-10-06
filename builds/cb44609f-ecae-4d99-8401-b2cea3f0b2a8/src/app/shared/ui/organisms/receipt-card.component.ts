import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { TransferReceipt } from '../../../core/accounts/model';
import { UiBadgeComponent } from '../atoms/badge.component';
import { UiButtonComponent } from '../atoms/button.component';
import { UiAmountSummaryComponent } from '../molecules/amount-summary.component';

@Component({
  selector: 'ui-receipt-card',
  standalone: true,
  imports: [DatePipe, UiBadgeComponent, UiButtonComponent, UiAmountSummaryComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div role="status" aria-live="polite">
      <ui-badge tone="success">Transferencia exitosa</ui-badge>
      <h3>Comprobante {{ receipt().reference }}</h3>
    </div>
    <dl class="details">
      <dt>Origen</dt>
      <dd>{{ receipt().fromAlias }}</dd>
      <dt>Destino</dt>
      <dd>{{ receipt().toAlias }}</dd>
      <dt>Concepto</dt>
      <dd>{{ receipt().concept || 'Sin concepto' }}</dd>
      <dt>Fecha</dt>
      <dd>{{ receipt().executedAt | date: 'medium' }}</dd>
    </dl>
    <ui-amount-summary label="Monto transferido" [amountCents]="receipt().amountCents" [currency]="receipt().currency" />
    <div class="actions">
      <ui-button (click)="newTransfer.emit()">Nueva transferencia</ui-button>
    </div>
  `,
})
export class ReceiptCardComponent {
  readonly receipt = input.required<TransferReceipt>();
  readonly newTransfer = output<void>();
}
