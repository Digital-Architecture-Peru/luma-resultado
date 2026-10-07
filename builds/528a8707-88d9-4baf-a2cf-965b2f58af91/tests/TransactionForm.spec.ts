import { describe, expect, it } from 'vitest';
import { mount } from '@vue/test-utils';
import TransactionForm from '../src/components/organisms/TransactionForm.vue';
import { SAMPLE_CARDS } from '../src/services/inMemoryGateway';

function mountForm() {
  return mount(TransactionForm, { props: { cards: SAMPLE_CARDS, submitting: false } });
}

describe('TransactionForm', () => {
  it('given empty form when submitted then shows errors and emits nothing', async () => {
    const wrapper = mountForm();
    await wrapper.find('form').trigger('submit');
    expect(wrapper.text()).toContain('Selecciona una tarjeta.');
    expect(wrapper.text()).toContain('Ingresa un monto numérico.');
    expect(wrapper.emitted('submit')).toBeUndefined();
  });

  it('given valid data when submitted then emits normalized request', async () => {
    const wrapper = mountForm();
    await wrapper.find('#card-select').setValue('c1');
    await wrapper.find('#amount').setValue('250000');
    await wrapper.find('#merchant').setValue('Proveedor SA');
    await wrapper.find('form').trigger('submit');
    expect(wrapper.emitted('submit')?.[0]).toEqual([
      { cardId: 'c1', amount: 250000, merchant: 'Proveedor SA', description: '' },
    ]);
  });

  it('given invalid amount when submitted then marks field as invalid', async () => {
    const wrapper = mountForm();
    await wrapper.find('#card-select').setValue('c1');
    await wrapper.find('#amount').setValue('abc');
    await wrapper.find('form').trigger('submit');
    expect(wrapper.find('#amount').attributes('aria-invalid')).toBe('true');
  });

  it('given submitting true when rendered then button is disabled', () => {
    const wrapper = mount(TransactionForm, { props: { cards: SAMPLE_CARDS, submitting: true } });
    expect(wrapper.find('button').attributes('disabled')).toBeDefined();
  });
});
