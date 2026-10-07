import { ChangeDetectionStrategy, Component, input } from '@angular/core';

/** Etiqueta + control proyectado + mensaje de ayuda/error asociado. */
@Component({
  selector: 'app-form-field',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="field">
      <label [attr.for]="controlId()">{{ label() }}</label>
      <ng-content />
      @if (error()) {
        <p class="field-error" [id]="controlId() + '-error'">{{ error() }}</p>
      }
    </div>
  `,
})
export class FormField {
  readonly label = input.required<string>();
  readonly controlId = input.required<string>();
  readonly error = input<string | null>(null);
}
