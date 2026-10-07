import { filterCards, maskCardNumber } from './card-query';
import { Card } from './card.model';

const base: Card = {
  id: 'x', holder: 'Logística Pacífico', last4: '1093', brand: 'Visa', status: 'ACTIVE',
  expiry: '01/30', creditLimit: 1000, balance: 10, currency: 'USD',
};
const cards: Card[] = [
  base,
  { ...base, id: 'y', holder: 'Andina', last4: '4821', brand: 'Mastercard', status: 'BLOCKED' },
];

describe('card-query', () => {
  it('given last4 when masking then hides the rest of the number', () => {
    expect(maskCardNumber('1093')).toBe('•••• •••• •••• 1093');
  });

  it('given empty query when filtering then returns every card', () => {
    expect(filterCards(cards, { text: '', status: 'ALL' })).toHaveLength(2);
  });

  it('given accented holder when searching without accent then matches', () => {
    const result = filterCards(cards, { text: 'logistica', status: 'ALL' });
    expect(result.map((c) => c.id)).toEqual(['x']);
  });

  it('given last4 text when filtering then matches by digits', () => {
    expect(filterCards(cards, { text: '4821', status: 'ALL' }).map((c) => c.id)).toEqual(['y']);
  });

  it('given status when filtering then only that status remains', () => {
    expect(filterCards(cards, { text: '', status: 'BLOCKED' }).map((c) => c.id)).toEqual(['y']);
  });

  it('given no match when filtering then returns empty list', () => {
    expect(filterCards(cards, { text: 'zzz', status: 'ALL' })).toEqual([]);
  });
});
