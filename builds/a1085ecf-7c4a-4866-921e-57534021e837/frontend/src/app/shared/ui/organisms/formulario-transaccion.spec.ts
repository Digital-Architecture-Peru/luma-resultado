import { TestBed } from '@angular/core/testing';
import { describe, expect, it } from 'vitest';
import { Tarjeta } from '../../../features/transaccion-tarjeta/models/transaccion.model';
import { EnvioTransaccion, FormularioTransaccion } from './formulario-transaccion';

const TARJETAS: Tarjeta[] = [{ id: 1, ultimos4: '1111', tipo: 'DEBITO', estado: 'ACTIVA' }];

function crear() {
  const fixture = TestBed.createComponent(FormularioTransaccion);
  fixture.componentRef.setInput('tarjetas', TARJETAS);
  const emitidos: EnvioTransaccion[] = [];
  fixture.componentInstance.confirmar.subscribe((e) => emitidos.push(e));
  return { componente: fixture.componentInstance, emitidos };
}

describe('FormularioTransaccion', () => {
  it('given sin tarjeta when enviar then no emite', () => {
    const { componente, emitidos } = crear();
    componente.cambiarMonto('10');
    componente.enviar();
    expect(emitidos).toHaveLength(0);
  });

  it('given monto inválido when enviar then no emite', () => {
    const { componente, emitidos } = crear();
    componente.seleccionarTarjeta(1);
    componente.cambiarMonto('-5');
    componente.enviar();
    expect(emitidos).toHaveLength(0);
  });

  it('given datos válidos when enviar then emite tarjeta y solicitud', () => {
    const { componente, emitidos } = crear();
    componente.seleccionarTarjeta(1);
    componente.cambiarMonto('25,50');
    componente.enviar();
    expect(emitidos).toEqual([{ tarjetaId: 1, solicitud: { monto: 25.5, moneda: 'USD' } }]);
  });
});
