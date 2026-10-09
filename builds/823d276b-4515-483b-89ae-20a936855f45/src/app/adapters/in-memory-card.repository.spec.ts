import { describe, expect, it } from 'vitest';
import { InMemoryCardRepository, SAMPLE_CARDS } from './in-memory-card.repository';

describe('InMemoryCardRepository', () => {
  it('given sample data when listing then resolves all cards', async () => {
    const repository = new InMemoryCardRepository(SAMPLE_CARDS, 0);
    const cards = await repository.list();
    expect(cards).toHaveLength(SAMPLE_CARDS.length);
  });

  it('given a list result when mutated then the source data is not affected', async () => {
    const repository = new InMemoryCardRepository(SAMPLE_CARDS, 0);
    const first = await repository.list();
    first.pop();
    expect(await repository.list()).toHaveLength(SAMPLE_CARDS.length);
  });

  it('given sample data then no card exposes a full card number', () => {
    for (const card of SAMPLE_CARDS) {
      expect(card.last4).toMatch(/^\d{4}$/);
    }
  });
});
