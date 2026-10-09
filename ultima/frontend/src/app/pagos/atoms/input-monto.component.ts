import { Component, input } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-input-monto',
  imports: [ReactiveFormsModule],
  template: `<input [id]="inputId()" type="number" inputmode="decimal" step="0.01" min="0.01"
    [formControl]="control()" [attr.aria-invalid]="control().invalid && control().touched" />`,
})
export class InputMontoComponent {
  readonly inputId = input.required<string>();
  readonly control = input.required<FormControl<number | null>>();
}
