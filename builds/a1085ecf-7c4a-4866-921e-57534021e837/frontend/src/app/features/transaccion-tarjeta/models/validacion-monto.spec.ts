import { describe, expect, it } from 'vitest';
import { validarMonto } from './validacion-monto';

describe('validarMonto', () => {
  it('given texto vacío when validar then error', () => {
    expect(validarMonto('  ').error).toBe('Ingrese un monto');
  });

  it('given monto con coma when validar then lo acepta', () => {
    expect(validarMonto('10,5')).toEqual({ valor: 10.5, error: null });
  });

  it('given tres decimales when validar then error', () => {
    expect(validarMonto('1.234').valor).toBeNull();
  });

  it('given cero when validar then error', () => {
    expect(validarMonto('0').error).toBe('El monto debe ser mayor que cero');
  });

  it('given monto sobre el máximo when validar then error', () => {
    expect(validarMonto('1000000.01').error).toBe('El monto excede el máximo permitido');
  });

  it('given letras when validar then error', () => {
    expect(validarMonto('abc').valor).toBeNull();
  });
});
