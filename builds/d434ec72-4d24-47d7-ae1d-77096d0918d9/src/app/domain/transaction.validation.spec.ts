import { describe, expect, it } from 'vitest';
import { Card, TransactionRequest } from './card.model';
import { parseAmount, validateTransaction } from './transaction.validation';

const card: Card = {
  id: 'c1',
  alias: 'Test',
  maskedNumber: '**** 0000',
  currency: 'PEN',
  creditLimit: 1000,
  availableCredit: 600,
  status: 'ACTIVE',
};

function request(overrides: Partial<TransactionRequest> = {}): TransactionRequest {
  return { cardId: 'c1', type: 'PURCHASE', amount: 100, description: 'Supermercado', ...overrides };
}

describe('parseAmount', () => {
  it('given a dot or comma decimal when parsed then returns the number', () => {
    expect(parseAmount('10.50')).toBe(10.5);
    expect(parseAmount(' 10,5 ')).toBe(10.5);
  });

  it('given invalid text when parsed then returns NaN', () => {
    expect(parseAmount('abc')).toBeNaN();
    expect(parseAmount('1.234')).toBeNaN();
    expect(parseAmount('-5')).toBeNaN();
    expect(parseAmount('')).toBeNaN();
  });
});

describe('validateTransaction', () => {
  it('given a valid purchase then there are no errors', () => {
    expect(validateTransaction(request(), card)).toEqual([]);
  });

  it('given no card then asks to select one', () => {
    expect(validateTransaction(request(), undefined)).toEqual(['Selecciona una tarjeta válida.']);
  });

  it('given a blocked card then rejects', () => {
    const errors = validateTransaction(request(), { ...card, status: 'BLOCKED' });
    expect(errors).toContain('La tarjeta está bloqueada y no admite operaciones.');
  });

  it('given NaN or zero amount then rejects', () => {
    expect(validateTransaction(request({ amount: Number.NaN }), card).length).toBe(1);
    expect(validateTransaction(request({ amount: 0 }), card).length).toBe(1);
  });

  it('given a purchase above available credit then rejects', () => {
    expect(validateTransaction(request({ amount: 601 }), card)).toContain(
      'El monto excede el crédito disponible.',
    );
  });

  it('given a purchase above the per-transaction limit then rejects', () => {
    const rich = { ...card, creditLimit: 99999, availableCredit: 99999 };
    expect(validateTransaction(request({ amount: 5001 }), rich)[0]).toContain('monto máximo');
  });

  it('given a payment above the debt then rejects, and equal to the debt then accepts', () => {
    expect(validateTransaction(request({ type: 'PAYMENT', amount: 401 }), card)).toContain(
      'El pago excede la deuda actual de la tarjeta.',
    );
    expect(validateTransaction(request({ type: 'PAYMENT', amount: 400 }), card)).toEqual([]);
  });

  it('given a too short description then rejects', () => {
    expect(validateTransaction(request({ description: ' a ' }), card)[0]).toContain('descripción');
  });
});
