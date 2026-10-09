import { Component, Input, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'app-amount-input',
  standalone: true,
  template: `
    <input
      [id]="inputId"
      type="number"
      inputmode="decimal"
      step="0.01"
      min="0.01"
      [value]="value ?? ''"
      [disabled]="disabled"
      (input)="onInput($event)"
      (blur)="onTouched()"
    />
  `,
  providers: [
    { provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => AmountInputComponent), multi: true },
  ],
})
export class AmountInputComponent implements ControlValueAccessor {
  @Input() inputId = 'amount';
  value: number | null = null;
  disabled = false;

  private onChange: (value: number | null) => void = () => undefined;
  onTouched: () => void = () => undefined;

  onInput(event: Event): void {
    const raw = (event.target as HTMLInputElement).value;
    this.value = raw === '' ? null : Number(raw);
    this.onChange(this.value);
  }

  writeValue(value: number | null): void {
    this.value = value;
  }

  registerOnChange(fn: (value: number | null) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }
}
