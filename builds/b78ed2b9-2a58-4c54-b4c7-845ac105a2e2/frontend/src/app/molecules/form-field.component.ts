import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-form-field',
  standalone: true,
  template: `
    <div class="field">
      <label [for]="inputId">{{ label }}</label>
      <ng-content />
      @if (error) {
        <p class="field-error" role="alert">{{ error }}</p>
      }
    </div>
  `,
})
export class FormFieldComponent {
  @Input({ required: true }) label = '';
  @Input({ required: true }) inputId = '';
  @Input() error = '';
}
