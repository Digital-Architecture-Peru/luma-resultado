import { DecimalPipe } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { Account } from '../models/payment.models';
import { FormFieldComponent } from './form-field.component';

@Component({
  selector: 'app-account-selector',
  standalone: true,
  imports: [ReactiveFormsModule, DecimalPipe, FormFieldComponent],
  template: `
    <app-form-field label="Cuenta origen" inputId="source" [error]="error">
      <select id="source" [formControl]="control">
        <option value="" disabled>Seleccione una cuenta</option>
        @for (a of accounts; track a.id) {
          <option [value]="a.id">{{ a.number }} · {{ a.balance | number: '1.2-2' }} {{ a.currency }}</option>
        }
      </select>
    </app-form-field>
  `,
})
export class AccountSelectorComponent {
  @Input({ required: true }) accounts: Account[] = [];
  @Input({ required: true }) control!: FormControl<string>;
  @Input() error: string | null = null;
}
