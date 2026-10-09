import { Component, Input } from '@angular/core';
import { FormControl } from '@angular/forms';
import { AmountInputComponent } from '../atoms/amount-input.component';
import { FieldErrorComponent } from '../atoms/field-error.component';

@Component({
  selector: 'app-amount-field',
  standalone: true,
  imports: [AmountInputComponent, FieldErrorComponent],
  template: `
    <div class="field">
      <label [for]="fieldId">{{ label }}</label>
      <app-amount-input [control]="control" [inputId]="fieldId" [describedBy]="fieldId + '-error'" />
      <app-field-error [message]="message" [errorId]="fieldId + '-error'" />
    </div>
  `,
})
export class AmountFieldComponent {
  @Input({ required: true }) control!: FormControl<string>;
  @Input() fieldId = 'amount';
  @Input() label = 'Monto';

  get message(): string | null {
    if (!this.control.touched || !this.control.errors) {
      return null;
    }
    const errors = this.control.errors;
    if (errors['required']) return 'Ingresa un monto';
    if (errors['amountFormat']) return 'Formato inválido (máximo 2 decimales)';
    if (errors['amountPositive']) return 'El monto debe ser mayor a 0';
    return 'Monto inválido';
  }
}
