import { ChangeDetectionStrategy, Component, input } from '@angular/core';

/** Átomo: etiqueta + control proyectado + mensaje de error accesible. */
@Component({
  selector: 'ui-field',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="field">
      <label [attr.for]="fieldId()">{{ label() }}</label>
      <ng-content />
      @if (error()) {
        <p class="field-error" role="alert" [id]="fieldId() + '-error'">{{ error() }}</p>
      }
    </div>
  `,
})
export class UiFieldComponent {
  readonly fieldId = input.required<string>();
  readonly label = input.required<string>();
  readonly error = input<string | undefined>(undefined);
}
