import { Component, Input } from '@angular/core';

/** Molecula: etiqueta + control proyectado + mensaje de error. */
@Component({
  selector: 'app-form-field',
  standalone: true,
  template: `
    <div class="field">
      <label [attr.for]="inputId">{{ label }}</label>
      <ng-content />
      @if (error) {
        <small class="error" role="alert">{{ error }}</small>
      }
    </div>
  `,
  styles: [`
    .field { display: flex; flex-direction: column; gap: var(--space-1); }
    label { font-weight: 600; }
    .error { color: var(--danger); }
  `],
})
export class FormFieldComponent {
  @Input({ required: true }) label = '';
  @Input({ required: true }) inputId = '';
  @Input() error: string | null = null;
}
