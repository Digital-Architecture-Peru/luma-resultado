import { describe, expect, it } from 'vitest';
import {
  claseTipo,
  enmascararTarjeta,
  etiquetaTipo,
  TipoNotificacion,
} from './notificacion.model';

describe('notificacion.model', () => {
  it('given cada tipo when etiquetaTipo then devuelve texto legible', () => {
    const tipos: TipoNotificacion[] = ['CONSUMO', 'VENCIMIENTO', 'BLOQUEO', 'PAGO_RECIBIDO'];
    expect(tipos.map(etiquetaTipo)).toEqual([
      'Consumo',
      'Vencimiento',
      'Bloqueo',
      'Pago recibido',
    ]);
  });

  it('given PAGO_RECIBIDO when claseTipo then genera clase CSS en kebab-case', () => {
    expect(claseTipo('PAGO_RECIBIDO')).toBe('tipo-pago-recibido');
    expect(claseTipo('BLOQUEO')).toBe('tipo-bloqueo');
  });

  it('given últimos 4 when enmascararTarjeta then nunca muestra más dígitos', () => {
    expect(enmascararTarjeta('1111')).toBe('•••• 1111');
  });
});
