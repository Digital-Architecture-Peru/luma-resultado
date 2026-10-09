import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

/** Molécula: etiqueta + control proyectado + mensaje de error asociado. */
@Component({
  selector: 'app-field',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="field">
      <label [attr.for]="controlId">{{ label }}</label>
      <ng-content />
      @if (error) {
        <p class="field-error" [id]="controlId + '-error'">{{ error }}</p>
      }
    </div>
  `,
})
export class FieldComponent {
  @Input({ required: true }) controlId = '';
  @Input({ required: true }) label = '';
  @Input() error: string | undefined;
}
