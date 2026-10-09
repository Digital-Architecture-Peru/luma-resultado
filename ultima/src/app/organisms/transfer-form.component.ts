import { CurrencyPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, input, output, signal } from '@angular/core';
import { Account, TransferRequest } from '../core/models/account.model';
import {
  MAX_CONCEPT_LENGTH,
  TransferErrors,
  hasErrors,
  parseAmount,
  validateTransfer,
} from '../core/models/transfer.validator';
import { UiButtonComponent } from '../atoms/ui-button.component';
import { UiFieldComponent } from '../atoms/ui-field.component';

/** Organismo: formulario de transferencia entre cuentas propias. */
@Component({
  selector: 'app-transfer-form',
  standalone: true,
  imports: [CurrencyPipe, UiButtonComponent, UiFieldComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <form class="panel" novalidate (submit)="onSubmit($event)" aria-labelledby="transfer-title">
      <h2 id="transfer-title">Nueva transferencia</h2>

      <ui-field fieldId="source" label="Cuenta de origen" [error]="errors().sourceId">
        <select id="source" name="source" [value]="sourceId()" (change)="sourceId.set(asValue($event))"
          [attr.aria-invalid]="errors().sourceId ? 'true' : null">
          <option value="">Selecciona…</option>
          @for (a of accounts(); track a.id) {
            <option [value]="a.id" [selected]="a.id === sourceId()">
              {{ a.alias }} · {{ a.balance | currency: a.currency : 'S/ ' }}
            </option>
          }
        </select>
      </ui-field>

      <ui-field fieldId="target" label="Cuenta de destino" [error]="errors().targetId">
        <select id="target" name="target" [value]="targetId()" (change)="targetId.set(asValue($event))"
          [attr.aria-invalid]="errors().targetId ? 'true' : null">
          <option value="">Selecciona…</option>
          @for (a of accounts(); track a.id) {
            <option [value]="a.id" [selected]="a.id === targetId()">{{ a.alias }} · {{ a.number }}</option>
          }
        </select>
      </ui-field>

      <ui-field fieldId="amount" label="Monto (S/)" [error]="errors().amount">
        <input id="amount" name="amount" type="text" inputmode="decimal" autocomplete="off"
          placeholder="0.00" [value]="amount()" (input)="amount.set(asValue($event))"
          [attr.aria-invalid]="errors().amount ? 'true' : null" />
      </ui-field>

      <ui-field fieldId="concept" label="Concepto (opcional)" [error]="errors().concept">
        <input id="concept" name="concept" type="text" autocomplete="off"
          [attr.maxlength]="maxConcept" [value]="concept()" (input)="concept.set(asValue($event))" />
      </ui-field>

      <ui-button type="submit" [disabled]="busy()">Transferir</ui-button>
    </form>
  `,
})
export class TransferFormComponent {
  readonly accounts = input.required<readonly Account[]>();
  readonly busy = input(false);
  readonly submitted = output<TransferRequest>();

  protected readonly maxConcept = MAX_CONCEPT_LENGTH;
  protected readonly sourceId = signal('');
  protected readonly targetId = signal('');
  protected readonly amount = signal('');
  protected readonly concept = signal('');
  protected readonly errors = signal<TransferErrors>({});

  protected asValue(event: Event): string {
    return (event.target as HTMLInputElement | HTMLSelectElement).value;
  }

  protected onSubmit(event: Event): void {
    event.preventDefault();
    const draft = {
      sourceId: this.sourceId(),
      targetId: this.targetId(),
      amount: parseAmount(this.amount()),
      concept: this.concept().trim(),
    };
    const errors = validateTransfer(draft, this.accounts());
    this.errors.set(errors);
    if (!hasErrors(errors)) {
      this.submitted.emit(draft);
    }
  }

  reset(): void {
    this.sourceId.set('');
    this.targetId.set('');
    this.amount.set('');
    this.concept.set('');
    this.errors.set({});
  }
}
