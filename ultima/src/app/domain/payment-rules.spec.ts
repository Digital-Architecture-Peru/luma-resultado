import { describe, expect, it } from 'vitest';
import { Account, Card } from './models';
import { formatMoney, resolveAmount, roundMoney, validatePayment } from './payment-rules';

const card: Card = { id: 'c1', alias: 'Visa', maskedNumber: '**** 1', brand: 'Visa', balance: 500, minimumPayment: 50, status: 'active' };
const account: Account = { id: 'a1', alias: 'Ahorros', maskedNumber: '**** 2', available: 300 };

describe('resolveAmount', () => {
  it('given minimum mode when resolving then returns the minimum payment', () => {
    expect(resolveAmount(card, 'minimum', null)).toBe(50);
  });
  it('given total mode when resolving then returns the balance', () => {
    expect(resolveAmount(card, 'total', null)).toBe(500);
  });
  it('given custom mode when resolving then rounds to cents', () => {
    expect(resolveAmount(card, 'custom', 10.456)).toBe(10.46);
  });
  it('given custom mode without value when resolving then returns zero', () => {
    expect(resolveAmount(card, 'custom', null)).toBe(0);
  });
  it('given no card when minimum then returns zero', () => {
    expect(resolveAmount(null, 'minimum', null)).toBe(0);
  });
});

describe('validatePayment', () => {
  it('given valid data when validating then has no errors', () => {
    expect(validatePayment(card, account, 100)).toEqual([]);
  });
  it('given amount above account funds when validating then reports insufficient balance', () => {
    expect(validatePayment(card, account, 400)).toContain('Saldo insuficiente en la cuenta de origen.');
  });
  it('given amount above debt when validating then reports excess', () => {
    expect(validatePayment(card, { ...account, available: 1000 }, 600)).toContain(
      'El monto no puede superar la deuda de la tarjeta.',
    );
  });
  it('given zero amount when validating then asks for a positive amount', () => {
    expect(validatePayment(card, account, 0)).toContain('Ingresa un monto mayor a cero.');
  });
  it('given blocked card when validating then rejects', () => {
    expect(validatePayment({ ...card, status: 'blocked' }, account, 10)[0]).toMatch(/bloqueada/);
  });
  it('given nothing selected when validating then asks for card and account', () => {
    const errors = validatePayment(null, null, 10);
    expect(errors).toEqual(['Selecciona una tarjeta.', 'Selecciona la cuenta de origen.']);
  });
});

describe('money helpers', () => {
  it('rounds to two decimals', () => {
    expect(roundMoney(1.005)).toBe(1.01);
  });
  it('formats as USD', () => {
    expect(formatMoney(1250.5)).toBe('$1,250.50');
  });
});
