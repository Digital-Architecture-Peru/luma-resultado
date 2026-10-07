import { describe, expect, it } from 'vitest';
import { flushPromises, mount } from '@vue/test-utils';
import TransactionPage from '../src/components/templates/TransactionPage.vue';
import { InMemoryGateway, SAMPLE_CARDS } from '../src/services/inMemoryGateway';

describe('TransactionPage', () => {
  it('given loaded cards when user submits then confirmation and history appear', async () => {
    const gateway = new InMemoryGateway(SAMPLE_CARDS, () => new Date('2026-01-01T00:00:00Z'));
    const wrapper = mount(TransactionPage, { props: { gateway } });
    await flushPromises();

    await wrapper.find('#card-select').setValue('c1');
    await wrapper.find('#amount').setValue('1000');
    await wrapper.find('#merchant').setValue('Proveedor SA');
    await wrapper.find('form').trigger('submit');
    await flushPromises();

    expect(wrapper.find('[role="status"]').text()).toContain('tx-0001');
    expect(wrapper.find('tbody').text()).toContain('Proveedor SA');
    expect((wrapper.find('#amount').element as HTMLInputElement).value).toBe('');
  });

  it('given gateway failing on load when mounted then shows alert', async () => {
    const failing = new InMemoryGateway();
    failing.listCards = async () => {
      throw new Error('boom');
    };
    const wrapper = mount(TransactionPage, { props: { gateway: failing } });
    await flushPromises();
    expect(wrapper.find('[role="alert"]').text()).toContain('No se pudo cargar');
  });
});
