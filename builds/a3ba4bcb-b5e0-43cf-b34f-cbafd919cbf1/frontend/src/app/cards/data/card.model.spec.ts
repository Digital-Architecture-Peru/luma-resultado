import { describe, expect, it } from 'vitest';
import { STATUS_LABELS, TYPE_LABELS, formatAmount } from './card.model';

describe('card.model helpers', () => {
  it('given every status, when labelled, then Spanish text exists', () => {
    expect(STATUS_LABELS.ACTIVE).toBe('Activa');
    expect(STATUS_LABELS.BLOCKED).toBe('Bloqueada');
    expect(STATUS_LABELS.CANCELLED).toBe('Cancelada');
  });

  it('given every type, when labelled, then Spanish text exists', () => {
    expect(TYPE_LABELS.CREDIT).toBe('Crédito');
    expect(TYPE_LABELS.DEBIT).toBe('Débito');
  });

  it('given an amount, when formatted, then includes digits with two decimals', () => {
    expect(formatAmount(3250.75, 'USD')).toMatch(/3[\s.,\u00a0]?250[.,]75/);
  });
});
