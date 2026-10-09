import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output, signal } from '@angular/core';
import { ButtonComponent } from '../atoms/button.component';
import { FieldComponent } from '../molecules/field.component';
import { Account, PaymentDraft, PaymentErrors } from '../core/payment.model';
import { hasErrors, validatePayment } from '../core/payment.validator';

/** Organismo: formulario de pago. Valida y emite el borrador; no conoce la red. */
@Component({
  selector: 'app-payment-form',
  standalone: true,
  imports: [ButtonComponent, FieldComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <form class="card" (submit)="onSubmit($event)" novalidate aria-labelledby="form-title">
      <h2 id="form-title">Nuevo pago</h2>

      <app-field controlId="source" label="Cuenta de origen" [error]="errors().sourceAccountId">
        <select id="source" name="source" [value]="draft().sourceAccountId" (change)="update('sourceAccountId', $any($event.target).value)">
          <option value="">Selecciona una cuenta</option>
          @for (a of accounts; track a.id) {
            <option [value]="a.id" [selected]="a.id === draft().sourceAccountId">{{ a.name }} - saldo {{ a.balance.toFixed(2) }}</option>
          }
        </select>
      </app-field>

      <app-field controlId="beneficiary" label="Beneficiario" [error]="errors().beneficiary">
        <input id="beneficiary" name="beneficiary" type="text" autocomplete="off" [value]="draft().beneficiary" (input)="update('beneficiary', $any($event.target).value)" />
      </app-field>

      <app-field controlId="amount" label="Monto" [error]="errors().amount">
        <input id="amount" name="amount" type="text" inputmode="decimal" autocomplete="off" [value]="draft().amount" (input)="update('amount', $any($event.target).value)" />
      </app-field>

      <app-field controlId="concept" label="Concepto (opcional)" [error]="errors().concept">
        <input id="concept" name="concept" type="text" autocomplete="off" [value]="draft().concept" (input)="update('concept', $any($event.target).value)" />
      </app-field>

      <app-button type="submit" [disabled]="busy">{{ busy ? 'Procesando...' : 'Pagar' }}</app-button>
    </form>
  `,
})
export class PaymentFormComponent {
  @Input() accounts: readonly Account[] = [];
  @Input() busy = false;
  @Output() readonly submitted = new EventEmitter<PaymentDraft>();

  protected readonly draft = signal<PaymentDraft>(emptyDraft());
  protected readonly errors = signal<PaymentErrors>({});

  protected update(field: keyof PaymentDraft, value: string): void {
    this.draft.update((d) => ({ ...d, [field]: value }));
  }

  protected onSubmit(event: Event): void {
    event.preventDefault();
    const errors = validatePayment(this.draft(), this.accounts);
    this.errors.set(errors);
    if (hasErrors(errors)) {
      return;
    }
    this.submitted.emit(this.draft());
    this.draft.set(emptyDraft());
  }
}

function emptyDraft(): PaymentDraft {
  return { sourceAccountId: '', beneficiary: '', amount: '', concept: '' };
}
