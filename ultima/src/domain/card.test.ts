import { describe, expect, it } from 'vitest';
import { filterCards, maskCardNumber } from './card';
import type { Card } from './card';

function makeCard(overrides: Partial<Card>): Card {
  return {
    id: 'x', alias: 'Visa Test', holder: 'Test', brand: 'Visa', type: 'credito',
    last4: '1111', status: 'activa', expiry: '01/30', currency: 'PEN',
    creditLimit: 1000, availableBalance: 500, ...overrides,
  };
}

describe('maskCardNumber', () => {
  it('given last4 when masking then hides the rest of the number', () => {
    expect(maskCardNumber('4821')).toBe('•••• •••• •••• 4821');
  });
});

describe('filterCards', () => {
  const cards = [
    makeCard({ id: '1', alias: 'Visa Platinum', last4: '4821' }),
    makeCard({ id: '2', alias: 'Débito Sueldo', brand: 'Mastercard', last4: '1093', status: 'bloqueada' }),
  ];

  it('given empty criteria when filtering then returns all cards', () => {
    expect(filterCards(cards, { query: '', status: 'todas' })).toHaveLength(2);
  });

  it('given a status when filtering then returns only that status', () => {
    const result = filterCards(cards, { query: '', status: 'bloqueada' });
    expect(result.map((c) => c.id)).toEqual(['2']);
  });

  it('given a query when filtering then matches alias, brand or last4 ignoring case', () => {
    expect(filterCards(cards, { query: 'PLATINUM', status: 'todas' }).map((c) => c.id)).toEqual(['1']);
    expect(filterCards(cards, { query: 'mastercard', status: 'todas' }).map((c) => c.id)).toEqual(['2']);
    expect(filterCards(cards, { query: '4821', status: 'todas' }).map((c) => c.id)).toEqual(['1']);
  });

  it('given no matches when filtering then returns empty list', () => {
    expect(filterCards(cards, { query: 'zzz', status: 'todas' })).toEqual([]);
  });
});
