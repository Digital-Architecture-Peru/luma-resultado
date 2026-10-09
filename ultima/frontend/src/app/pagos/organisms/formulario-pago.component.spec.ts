import { TestBed } from '@angular/core/testing';
import { beforeEach, describe, expect, it } from 'vitest';
import { PagoRequest } from '../pago.model';
import { FormularioPagoComponent } from './formulario-pago.component';

describe('FormularioPagoComponent', () => {
  let componente: FormularioPagoComponent;

  beforeEach(() => {
    TestBed.configureTestingModule({ imports: [FormularioPagoComponent] });
    componente = TestBed.createComponent(FormularioPagoComponent).componentInstance;
  });

  it('given formulario vacío, when se valida, then es inválido', () => {
    expect(componente.form.invalid).toBe(true);
  });

  it('given cuentas iguales, when se valida, then marca mismaCuenta', () => {
    componente.form.patchValue({ cuentaOrigen: '0000-FAKE-0001', cuentaDestino: '0000-FAKE-0001', monto: 5 });
    expect(componente.form.hasError('mismaCuenta')).toBe(true);
  });

  it('given monto cero, when se valida, then el control monto es inválido', () => {
    componente.form.controls.monto.setValue(0);
    expect(componente.form.controls.monto.invalid).toBe(true);
  });

  it('given datos válidos, when alEnviar, then emite la solicitud', () => {
    const emitidos: PagoRequest[] = [];
    componente.pagoEnviado.subscribe((p) => emitidos.push(p));
    componente.form.setValue({
      cuentaOrigen: '0000-FAKE-0001',
      cuentaDestino: '0000-FAKE-0002',
      monto: 25.5,
      moneda: 'USD',
    });

    componente.alEnviar();

    expect(emitidos).toEqual([
      { cuentaOrigen: '0000-FAKE-0001', cuentaDestino: '0000-FAKE-0002', monto: 25.5, moneda: 'USD' },
    ]);
  });

  it('given datos inválidos, when alEnviar, then no emite y marca controles como tocados', () => {
    const emitidos: PagoRequest[] = [];
    componente.pagoEnviado.subscribe((p) => emitidos.push(p));

    componente.alEnviar();

    expect(emitidos).toHaveLength(0);
    expect(componente.form.controls.cuentaOrigen.touched).toBe(true);
  });
});
