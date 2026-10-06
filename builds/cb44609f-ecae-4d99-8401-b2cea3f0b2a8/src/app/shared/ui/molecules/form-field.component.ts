import { ChangeDetectionStrategy, Component, input } from '@angular/core';

/** Etiqueta + control proyectado + pista + mensaje de error accesible (aria-live). */
@Component({
  selector: 'ui-form-field',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.Default,
  template: `
    <div class="field" [class.field--error]="!!error()">
      <label [for]="forId()">{{ label() }}</label>
      <ng-content />
      @if (hint()) {
        <small [id]="forId() + '-hint'">{{ hint() }}</small>
      }
      <div class="field__error" [id]="forId() + '-error'" aria-live="polite">{{ error() }}</div>
    </div>
  `,
})
export class UiFormFieldComponent {
  readonly label = input.required<string>();
  readonly forId = input.required<string>();
  readonly error = input<string | null>(null);
  readonly hint = input<string | null>(null);
}
