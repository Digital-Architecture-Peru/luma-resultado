import { Component, Input } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { FieldErrorComponent } from '../atoms/field-error.component';
import { Account } from '../core/models';

@Component({
  selector: 'app-account-selector',
  standalone: true,
  imports: [ReactiveFormsModule, FieldErrorComponent],
  template: `
    <div class="field">
      <label [for]="fieldId">{{ label }}</label>
      <select class="input" [id]="fieldId" [formControl]="control" [attr.aria-describedby]="fieldId + '-error'">
        <option [ngValue]="null">Selecciona una cuenta</option>
        @for (account of accounts; track account.id) {
          <option [ngValue]="account.id">{{ account.numberMasked }} · {{ account.currency }} {{ account.balance }}</option>
        }
      </select>
      <app-field-error [message]="message" [errorId]="fieldId + '-error'" />
    </div>
  `,
})
export class AccountSelectorComponent {
  @Input({ required: true }) control!: FormControl<number | null>;
  @Input() accounts: Account[] = [];
  @Input() fieldId = 'account';
  @Input() label = 'Cuenta';
  /** Error de formulario (p. ej. cuentas iguales) que se muestra tras interactuar. */
  @Input() extraError: string | null = null;

  get message(): string | null {
    if (!this.control.touched) {
      return null;
    }
    if (this.control.errors?.['required']) {
      return 'Selecciona una cuenta';
    }
    return this.extraError;
  }
}
