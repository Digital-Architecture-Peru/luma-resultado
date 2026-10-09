import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';

/** Átomo: campo de texto para importes, con etiqueta y error asociados (aria-describedby). */
@Component({
  selector: 'app-input-monto',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <label class="campo__etiqueta" [for]="campoId()">{{ etiqueta() }}</label>
    <input
      class="campo__control"
      type="text"
      inputmode="decimal"
      autocomplete="off"
      [id]="campoId()"
      [value]="valor()"
      [attr.aria-invalid]="error() ? 'true' : null"
      [attr.aria-describedby]="error() ? campoId() + '-error' : null"
      (input)="valorChange.emit($any($event.target).value)"
    />
    @if (error()) {
      <p class="campo__error" [id]="campoId() + '-error'">{{ error() }}</p>
    }
  `,
})
export class InputMontoComponent {
  readonly campoId = input('monto');
  readonly etiqueta = input('Monto');
  readonly valor = input('');
  readonly error = input<string | null>(null);
  readonly valorChange = output<string>();
}
