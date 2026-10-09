import { DecimalPipe } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { Account } from '../core/models';

@Component({
  selector: 'app-account-select',
  standalone: true,
  imports: [ReactiveFormsModule, DecimalPipe],
  template: `<select class="input" [id]="selectId" [formControl]="control">
    <option [ngValue]="null" disabled>Seleccione una cuenta</option>
    @for (a of accounts; track a.id) {
      <option [ngValue]="a.id">{{ a.number }} · {{ a.currency }} {{ a.balance | number: '1.2-2' }}</option>
    }
  </select>`,
})
export class AccountSelectComponent {
  @Input({ required: true }) control!: FormControl<number | null>;
  @Input() accounts: Account[] = [];
  @Input() selectId = 'account';
}
