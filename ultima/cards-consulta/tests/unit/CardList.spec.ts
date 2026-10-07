import { describe, expect, it } from 'vitest';
import { mount } from '@vue/test-utils';
import CardList from '../../src/components/organisms/CardList.vue';
import { cardsFixture } from '../../src/mocks/cards.fixture';

describe('CardList', () => {
  it('given cards when rendering then shows one button per card with masked number', () => {
    const w = mount(CardList, { props: { cards: cardsFixture, selectedId: null } });
    expect(w.findAll('button')).toHaveLength(cardsFixture.length);
    expect(w.text()).toContain('•••• 1234');
  });

  it('given a click when selecting then emits select with the card id', async () => {
    const w = mount(CardList, { props: { cards: cardsFixture, selectedId: null } });
    await w.findAll('button')[1].trigger('click');
    expect(w.emitted('select')?.[0]).toEqual(['c-002']);
  });

  it('given selectedId then that item is marked aria-pressed', () => {
    const w = mount(CardList, { props: { cards: cardsFixture, selectedId: 'c-001' } });
    expect(w.findAll('button')[0].attributes('aria-pressed')).toBe('true');
    expect(w.findAll('button')[1].attributes('aria-pressed')).toBe('false');
  });
});
