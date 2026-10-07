import { describe, expect, it } from 'vitest';
import { flushPromises, mount } from '@vue/test-utils';
import TransactionPage from '../src/components/pages/TransactionPage.vue';
import { createInMemoryGateway } from '../src/services/transactionGateway';

describe('TransactionPage', () => {
  it('given valid payment when submitted then announces approval and lists movement', async () => {
    const wrapper = mount(TransactionPage, { props: { gateway: createInMemoryGateway() } });
    await flushPromises();

    await wrapper.find('select').setValue('c1');
    await wrapper.find('#amount').setValue('10');
    await wrapper.find('#merchant').setValue('Librería');
    await wrapper.find('form').trigger('submit');
    await flushPromises();

    expect(wrapper.find('[role="status"]').text()).toContain('aprobada');
    expect(wrapper.find('.tx-list').text()).toContain('Librería');
  });

  it('given no movements when loaded then shows empty state', async () => {
    const wrapper = mount(TransactionPage, { props: { gateway: createInMemoryGateway() } });
    await flushPromises();
    expect(wrapper.text()).toContain('Aún no hay movimientos.');
  });
});
