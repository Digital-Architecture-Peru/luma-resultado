import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { Account } from '../../../core/accounts/model';
import { UiButtonComponent } from '../atoms/button.component';
import { UiAmountSummaryComponent } from '../molecules/amount-summary.component';

@Component({
  selector: 'ui-confirmation-panel',
  standalone: true,
  imports: [UiButtonComponent, UiAmountSummaryComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <h3>Revisa los datos antes de confirmar</h3>
    <dl class="details">
      <dt>Origen</dt>
      <dd>{{ from()?.alias }} {{ from()?.maskedNumber }}</dd>
      <dt>Destino</dt>
      <dd>{{ to()?.alias }} {{ to()?.maskedNumber }}</dd>
      <dt>Concepto</dt>
      <dd>{{ concept() || 'Sin concepto' }}</dd>
    </dl>
    <ui-amount-summary label="Monto a transferir" [amountCents]="amountCents()" />

    @if (error()) {
      <div class="alert" role="alert">{{ error() }}</div>
    }

    <div class="actions">
      <ui-button variant="secondary" [disabled]="submitting()" (click)="back.emit()">Volver</ui-button>
      <ui-button [loading]="submitting()" (click)="confirmed.emit()">
        {{ error() ? 'Reintentar' : 'Confirmar transferencia' }}
      </ui-button>
    </div>
  `,
})
export class ConfirmationPanelComponent {
  readonly from = input<Account | null>(null);
  readonly to = input<Account | null>(null);
  readonly amountCents = input.required<number>();
  readonly concept = input('');
  readonly submitting = input(false);
  readonly error = input<string | null>(null);
  readonly confirmed = output<void>();
  readonly back = output<void>();
}
