import { Component, Input } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-amount-input',
  standalone: true,
  imports: [ReactiveFormsModule],
  template: `<input
    class="input"
    type="text"
    inputmode="decimal"
    autocomplete="off"
    placeholder="0.00"
    [id]="inputId"
    [formControl]="control"
    [attr.aria-invalid]="control.invalid && control.touched"
    [attr.aria-describedby]="describedBy"
  />`,
})
export class AmountInputComponent {
  @Input({ required: true }) control!: FormControl<string>;
  @Input() inputId = '';
  @Input() describedBy: string | null = null;
}
