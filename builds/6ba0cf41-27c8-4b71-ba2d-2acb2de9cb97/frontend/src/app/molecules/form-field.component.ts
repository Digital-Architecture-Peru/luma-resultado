import { Component, Input } from '@angular/core';
import { AbstractControl } from '@angular/forms';

@Component({
  selector: 'app-form-field',
  standalone: true,
  template: `
    <div class="field">
      <label [attr.for]="fieldId">{{ label }}</label>
      <ng-content></ng-content>
      @if (showError) {
        <p class="error" role="alert">{{ errorMessage }}</p>
      } @else if (hint) {
        <p class="hint">{{ hint }}</p>
      }
    </div>`,
  styles: [
    `.field { display: grid; gap: 4px; margin-block-end: 16px; }
     label { font-weight: 600; }
     .hint { margin: 0; color: var(--muted); font-size: 0.875rem; }
     .error { margin: 0; font-size: 0.875rem; }`
  ]
})
export class FormFieldComponent {
  @Input({ required: true }) label!: string;
  @Input({ required: true }) fieldId!: string;
  @Input({ required: true }) control!: AbstractControl;
  @Input() hint = '';
  @Input() patternMessage = 'Formato inválido.';

  get showError(): boolean {
    return this.control.invalid && (this.control.touched || this.control.dirty);
  }

  get errorMessage(): string {
    const errors = this.control.errors;
    if (!errors) {
      return '';
    }
    if (errors['required']) {
      return 'Campo obligatorio.';
    }
    if (errors['pattern']) {
      return this.patternMessage;
    }
    if (errors['maxlength']) {
      return 'Texto demasiado largo.';
    }
    const custom = Object.values(errors).find((v): v is string => typeof v === 'string');
    return custom ?? 'Valor inválido.';
  }
}
