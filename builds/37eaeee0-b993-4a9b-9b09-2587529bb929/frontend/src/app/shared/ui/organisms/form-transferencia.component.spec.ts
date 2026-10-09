import { provideZonelessChangeDetection } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { beforeEach, describe, expect, it } from 'vitest';
import { Cuenta, TransferenciaSolicitud } from '../../../features/transferencias/data-access/models';
import { FormTransferenciaComponent } from './form-transferencia.component';

const CUENTAS: Cuenta[] = [
  { id: 'a', numeroEnmascarado: '****-0001', moneda: 'USD', saldo: 100 },
  { id: 'b', numeroEnmascarado: '****-0002', moneda: 'USD', saldo: 5 },
];

describe('FormTransferenciaComponent', () => {
  let fixture: ComponentFixture<FormTransferenciaComponent>;
  let componente: FormTransferenciaComponent;
  let emitidas: TransferenciaSolicitud[];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormTransferenciaComponent],
      providers: [provideZonelessChangeDetection()],
    }).compileComponents();
    fixture = TestBed.createComponent(FormTransferenciaComponent);
    componente = fixture.componentInstance;
    fixture.componentRef.setInput('cuentas', CUENTAS);
    emitidas = [];
    componente.enviar.subscribe((s) => emitidas.push(s));
    fixture.detectChanges();
  });

  const enviarFormulario = async (): Promise<void> => {
    const form = (fixture.nativeElement as HTMLElement).querySelector('form')!;
    form.dispatchEvent(new Event('submit', { cancelable: true }));
    await fixture.whenStable();
    fixture.detectChanges();
  };

  it('given sin monto, then el formulario es inválido y no emite', async () => {
    componente.origenId.set('a');
    componente.destinoId.set('b');

    expect(componente.valido()).toBe(false);
    await enviarFormulario();

    expect(emitidas).toHaveLength(0);
    expect((fixture.nativeElement as HTMLElement).textContent).toContain('Ingrese un monto mayor que cero');
  });

  it('given monto superior al saldo, then es inválido', () => {
    componente.origenId.set('a');
    componente.destinoId.set('b');
    componente.monto.set('100.01');

    expect(componente.valido()).toBe(false);
  });

  it('given origen igual a destino, then es inválido', () => {
    componente.origenId.set('a');
    componente.destinoId.set('a');
    componente.monto.set('10');

    expect(componente.valido()).toBe(false);
  });

  it('given datos válidos, when se envía, then emite la solicitud con la moneda del origen', async () => {
    componente.origenId.set('a');
    componente.destinoId.set('b');
    componente.monto.set('25.50');
    componente.concepto.set(' alquiler ');

    await enviarFormulario();

    expect(emitidas).toEqual([
      { origenId: 'a', destinoId: 'b', monto: 25.5, moneda: 'USD', concepto: 'alquiler' },
    ]);
  });
});
