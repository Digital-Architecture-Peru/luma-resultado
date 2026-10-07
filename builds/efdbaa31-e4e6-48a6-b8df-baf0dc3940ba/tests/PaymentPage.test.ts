import { describe, expect, it } from 'vitest';
import { flushPromises, mount } from '@vue/test-utils';
import PaymentPage from '../src/components/pages/PaymentPage.vue';
import FormField from '../src/components/molecules/FormField.vue';
import { InMemoryPaymentGateway } from '../src/services/paymentGateway';

async function mountPage() {
  const wrapper = mount(PaymentPage, { props: { gateway: new InMemoryPaymentGateway() } });
  await flushPromises();
  return wrapper;
}

describe('FormField', () => {
  it('given error then links it to the control through aria-describedby', () => {
    const wrapper = mount(FormField, {
      props: { id: 'amount', label: 'Importe', error: 'Mal' },
      slots: { default: '<template #default="s"><input :id="s.id" :aria-describedby="s.describedby" /></template>' }
    });
    expect(wrapper.get('input').attributes('aria-describedby')).toBe('amount-error');
    expect(wrapper.get('#amount-error').text()).toBe('Mal');
  });
});

describe('PaymentPage', () => {
  it('given loaded data then lists accounts and beneficiaries', async () => {
    const wrapper = await mountPage();
    expect(wrapper.get('#source').findAll('option').length).toBe(3);
    expect(wrapper.get('#beneficiary').findAll('option').length).toBe(4);
  });

  it('given empty form when submitted then shows field errors in role=status and fields', async () => {
    const wrapper = await mountPage();
    await wrapper.get('form').trigger('submit');
    await flushPromises();
    expect(wrapper.get('[role="status"]').text()).toMatch(/Revisa/);
    expect(wrapper.get('#amount-error').text()).toMatch(/importe/i);
  });

  it('given valid form when submitted then shows receipt and history', async () => {
    const wrapper = await mountPage();
    await wrapper.get('#source').setValue('acc-1');
    await wrapper.get('#beneficiary').setValue('ben-2');
    await wrapper.get('#amount').setValue('150.25');
    await wrapper.get('#concept').setValue('Pensión');
    await wrapper.get('form').trigger('submit');
    await flushPromises();

    expect(wrapper.get('[role="status"]').text()).toContain('PAG-000001');
    expect(wrapper.get('[data-test="reference"]').text()).toBe('PAG-000001');
    expect(wrapper.get('.history').text()).toContain('Pensión');
  });

  it('given amount above balance when submitted then shows insufficient funds', async () => {
    const wrapper = await mountPage();
    await wrapper.get('#source').setValue('acc-1');
    await wrapper.get('#beneficiary').setValue('ben-1');
    await wrapper.get('#amount').setValue('9999');
    await wrapper.get('#concept').setValue('Grande');
    await wrapper.get('form').trigger('submit');
    await flushPromises();
    expect(wrapper.get('#amount-error').text()).toMatch(/insuficiente/i);
  });
});
