import { DecimalPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { Cuenta } from '../../../features/transferencias/data-access/models';

/** Molécula: etiqueta + select de cuentas + mensaje de error. */
@Component({
  selector: 'app-selector-cuenta',
  imports: [DecimalPipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <label class="campo__etiqueta" [for]="campoId()">{{ etiqueta() }}</label>
    <select
      class="campo__control"
      [id]="campoId()"
      [attr.aria-invalid]="error() ? 'true' : null"
      [attr.aria-describedby]="error() ? campoId() + '-error' : null"
      (change)="seleccionada.emit($any($event.target).value)"
    >
      <option value="" [selected]="!valor()">Seleccione una cuenta</option>
      @for (c of cuentas(); track c.id) {
        <option [value]="c.id" [selected]="c.id === valor()">
          {{ c.numeroEnmascarado }} · {{ c.saldo | number: '1.2-2' }} {{ c.moneda }}
        </option>
      }
    </select>
    @if (error()) {
      <p class="campo__error" [id]="campoId() + '-error'">{{ error() }}</p>
    }
  `,
})
export class SelectorCuentaComponent {
  readonly campoId = input.required<string>();
  readonly etiqueta = input.required<string>();
  readonly cuentas = input<Cuenta[]>([]);
  readonly valor = input('');
  readonly error = input<string | null>(null);
  readonly seleccionada = output<string>();
}
