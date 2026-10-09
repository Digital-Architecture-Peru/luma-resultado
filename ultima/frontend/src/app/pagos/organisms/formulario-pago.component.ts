import { Component, input, output } from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { BotonComponent } from '../atoms/boton.component';
import { InputMontoComponent } from '../atoms/input-monto.component';
import { CampoCuentaComponent } from '../molecules/campo-cuenta.component';
import { MONEDAS, PATRON_CUENTA, PagoRequest } from '../pago.model';

export function cuentasDistintas(grupo: AbstractControl): ValidationErrors | null {
  const origen = grupo.get('cuentaOrigen')?.value as string | undefined;
  const destino = grupo.get('cuentaDestino')?.value as string | undefined;
  return origen && destino && origen === destino ? { mismaCuenta: true } : null;
}

@Component({
  selector: 'app-formulario-pago',
  imports: [ReactiveFormsModule, CampoCuentaComponent, InputMontoComponent, BotonComponent],
  template: `
    <form [formGroup]="form" (ngSubmit)="alEnviar()" novalidate>
      <app-campo-cuenta etiqueta="Cuenta de origen" inputId="cuentaOrigen" [control]="form.controls.cuentaOrigen" />
      <app-campo-cuenta etiqueta="Cuenta de destino" inputId="cuentaDestino" [control]="form.controls.cuentaDestino" />
      @if (form.hasError('mismaCuenta') && form.controls.cuentaDestino.touched) {
        <p class="error" role="alert">La cuenta de origen y destino deben ser distintas.</p>
      }
      <div class="field">
        <label for="monto">Monto</label>
        <app-input-monto inputId="monto" [control]="form.controls.monto" />
        @if (form.controls.monto.invalid && form.controls.monto.touched) {
          <p class="error">Ingrese un monto mayor que cero.</p>
        }
      </div>
      <div class="field">
        <label for="moneda">Moneda</label>
        <select id="moneda" formControlName="moneda">
          @for (m of monedas; track m) {
            <option [value]="m">{{ m }}</option>
          }
        </select>
      </div>
      <app-boton etiqueta="Pagar" tipo="submit" [deshabilitado]="enviando()" />
    </form>
  `,
})
export class FormularioPagoComponent {
  readonly enviando = input(false);
  readonly pagoEnviado = output<PagoRequest>();
  readonly monedas = MONEDAS;

  readonly form = new FormGroup(
    {
      cuentaOrigen: new FormControl('', {
        nonNullable: true,
        validators: [Validators.required, Validators.pattern(PATRON_CUENTA)],
      }),
      cuentaDestino: new FormControl('', {
        nonNullable: true,
        validators: [Validators.required, Validators.pattern(PATRON_CUENTA)],
      }),
      monto: new FormControl<number | null>(null, [Validators.required, Validators.min(0.01)]),
      moneda: new FormControl('USD', { nonNullable: true, validators: [Validators.required] }),
    },
    { validators: cuentasDistintas },
  );

  alEnviar(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const { cuentaOrigen, cuentaDestino, monto, moneda } = this.form.getRawValue();
    this.pagoEnviado.emit({ cuentaOrigen, cuentaDestino, monto: Number(monto), moneda });
  }
}
