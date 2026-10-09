import { describe, expect, it } from 'vitest';
import { validateAmount } from './amount';

describe('validateAmount', () => {
  it('given empty input then asks for an amount', () => {
    expect(validateAmount('  ')).toBe('Ingrese el monto a pagar');
  });

  it('given non numeric input then rejects it', () => {
    expect(validateAmount('abc')).not.toBeNull();
    expect(validateAmount('10.123')).not.toBeNull();
    expect(validateAmount('-5')).not.toBeNull();
  });

  it('given zero then rejects it', () => {
    expect(validateAmount('0.00')).toBe('El monto debe ser mayor a cero');
  });

  it('given amount above debt then rejects it', () => {
    expect(validateAmount('200.00', '100.00')).toBe('El monto excede la deuda de la tarjeta');
  });

  it('given a valid amount then returns null', () => {
    expect(validateAmount('150.00', '1250.50')).toBeNull();
    expect(validateAmount('99')).toBeNull();
  });
});
