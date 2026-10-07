import { describe, expect, it } from 'vitest';
import { mount } from '@vue/test-utils';
import TransactionForm from '../src/components/organisms/TransactionForm.vue';
import type { Card } from '../src/domain/types';

const cards: Card[] = [
  { id: 'c1', alias: 'Nómina', brand: 'Visa', last4: '4242', available: 500, status: 'active' },
];

describe('TransactionForm', () => {
  it('given empty form when submitted then shows errors and emits nothing', async () => {
    const wrapper = mount(TransactionForm, { props: { cards } });
    await wrapper.find('form').trigger('submit');

    expect(wrapper.emitted('submit')).toBeUndefined();
    expect(wrapper.findAll('.field-error').length).toBe(3);
  });

  it('given valid values when submitted then emits normalized input', async () => {
    const wrapper = mount(TransactionForm, { props: { cards } });
    await wrapper.find('select').setValue('c1');
    await wrapper.find('#amount').setValue('25,5');
    await wrapper.find('#merchant').setValue('  Café  ');
    await wrapper.find('form').trigger('submit');

    expect(wrapper.emitted('submit')).toEqual([[{ cardId: 'c1', amount: 25.5, merchant: 'Café' }]]);
  });

  it('given submitting flag then button is disabled', () => {
    const wrapper = mount(TransactionForm, { props: { cards, submitting: true } });
    expect(wrapper.find('button').attributes('disabled')).toBeDefined();
  });
});
