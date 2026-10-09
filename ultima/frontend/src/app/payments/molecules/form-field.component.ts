import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-form-field',
  standalone: true,
  template: `
    <div class="field">
      <label [attr.for]="inputId">{{ label }}</label>
      <ng-content />
      @if (error) {
        <p class="error" role="alert">{{ error }}</p>
      }
    </div>
  `,
  styles: [
    `
      .field {
        display: grid;
        gap: var(--space-1);
        margin-block-end: var(--space-4);
      }
      label {
        font-weight: 600;
      }
      .error {
        margin: 0;
        color: var(--danger);
        font-size: 0.875rem;
      }
    `,
  ],
})
export class FormFieldComponent {
  @Input({ required: true }) label = '';
  @Input({ required: true }) inputId = '';
  @Input() error: string | null = null;
}
