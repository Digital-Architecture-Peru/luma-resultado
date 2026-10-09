import { describe, expect, it } from 'vitest';
import { SAMPLE_CARDS } from '../adapters/in-memory-card.repository';
import { EMPTY_QUERY, filterCards } from './card-query';

describe('filterCards', () => {
  it('given an empty query when filtering then returns all cards', () => {
    expect(filterCards(SAMPLE_CARDS, EMPTY_QUERY)).toHaveLength(SAMPLE_CARDS.length);
  });

  it('given a status when filtering then returns only that status', () => {
    const result = filterCards(SAMPLE_CARDS, { ...EMPTY_QUERY, status: 'blocked' });
    expect(result.map((c) => c.id)).toEqual(['c-003']);
  });

  it('given last4 text when filtering then matches by last digits', () => {
    const result = filterCards(SAMPLE_CARDS, { text: '4821', status: 'all' });
    expect(result.map((c) => c.id)).toEqual(['c-001']);
  });

  it('given text with different case and accents when filtering then still matches', () => {
    const result = filterCards(SAMPLE_CARDS, { text: '  MASTERCARD ', status: 'all' });
    expect(result.map((c) => c.id)).toEqual(['c-002', 'c-004']);
  });

  it('given text and status when filtering then both must match', () => {
    const result = filterCards(SAMPLE_CARDS, { text: 'visa', status: 'active' });
    expect(result.map((c) => c.id)).toEqual(['c-001']);
  });

  it('given no match when filtering then returns an empty list', () => {
    expect(filterCards(SAMPLE_CARDS, { text: 'zzz', status: 'all' })).toEqual([]);
  });
});
