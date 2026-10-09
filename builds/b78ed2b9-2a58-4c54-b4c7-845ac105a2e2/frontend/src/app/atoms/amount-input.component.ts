import { Component, Input } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-amount-input',
  standalone: true,
  imports: [ReactiveFormsModule],
  template: `<input class="input" type="number" inputmode="decimal" step="0.01" min="0" [id]="inputId" [formControl]="control" />`,
})
export class AmountInputComponent {
  @Input({ required: true }) control!: FormControl<number>;
  @Input({ required: true }) inputId = '';
}
