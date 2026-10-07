import { describe, expect, it } from 'vitest';
import { useCards } from '../../src/composables/useCards';
import { MockCardsRepository } from '../../src/services/MockCardsRepository';
import { cardsFixture } from '../../src/mocks/cards.fixture';

describe('useCards', () => {
  it('given a working repository when loading then state is data', async () => {
    const c = useCards(new MockCardsRepository());
    await c.load();
    expect(c.state.value).toBe('data');
    expect(c.cards.value).toHaveLength(cardsFixture.length);
  });

  it('given a failing repository when loading then state is error with message', async () => {
    const c = useCards(new MockCardsRepository({ fail: true }));
    await c.load();
    expect(c.state.value).toBe('error');
    expect(c.error.value).toContain('no disponible');
    expect(c.cards.value).toEqual([]);
  });

  it('given no cards when loading then state is empty', async () => {
    const c = useCards(new MockCardsRepository({ data: [] }));
    await c.load();
    expect(c.state.value).toBe('empty');
  });

  it('given a pending load then state is loading', async () => {
    const c = useCards(new MockCardsRepository());
    const p = c.load();
    expect(c.state.value).toBe('loading');
    await p;
  });

  it('given a card id when selecting then selected exposes that card', async () => {
    const c = useCards(new MockCardsRepository());
    await c.load();
    c.select('c-002');
    expect(c.selected.value?.alias).toBe('Viajes');
    c.select('nope');
    expect(c.selected.value).toBeNull();
  });
});
