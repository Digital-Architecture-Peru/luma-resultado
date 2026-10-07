import { describe, expect, it } from 'vitest';
import { flushPromises, mount } from '@vue/test-utils';
import CardsPage from './CardsPage.vue';
import { InMemoryCardRepository } from '../../services/cardRepository';
import type { CardRepository } from '../../services/cardRepository';
import type { Card } from '../../domain/card';

describe('CardsPage', () => {
  it('given a repository when mounted then lists cards with masked numbers', async () => {
    const wrapper = mount(CardsPage, { props: { repository: new InMemoryCardRepository() } });
    expect(wrapper.find('[role="status"]').text()).toContain('Cargando');
    await flushPromises();
    expect(wrapper.findAll('article')).toHaveLength(4);
    expect(wrapper.text()).toContain('•••• •••• •••• 4821');
    expect(wrapper.text()).not.toMatch(/\d{4} \d{4} \d{4} \d{4}/);
  });

  it('given the status filter when selecting bloqueada then shows only blocked cards', async () => {
    const wrapper = mount(CardsPage, { props: { repository: new InMemoryCardRepository() } });
    await flushPromises();
    await wrapper.find('select').setValue('bloqueada');
    expect(wrapper.findAll('article')).toHaveLength(1);
    expect(wrapper.text()).toContain('Mastercard Gold');
  });

  it('given a query without matches when typing then shows the empty state', async () => {
    const wrapper = mount(CardsPage, { props: { repository: new InMemoryCardRepository() } });
    await flushPromises();
    await wrapper.find('input[type="search"]').setValue('inexistente');
    expect(wrapper.findAll('article')).toHaveLength(0);
    expect(wrapper.text()).toContain('No hay tarjetas');
  });

  it('given a failing repository when mounted then shows an alert and retries', async () => {
    let calls = 0;
    const repository: CardRepository = {
      async list(): Promise<Card[]> {
        calls += 1;
        throw new Error('fallo simulado');
      },
    };
    const wrapper = mount(CardsPage, { props: { repository } });
    await flushPromises();
    expect(wrapper.find('[role="alert"]').exists()).toBe(true);
    await wrapper.find('button').trigger('click');
    await flushPromises();
    expect(calls).toBe(2);
  });
});
