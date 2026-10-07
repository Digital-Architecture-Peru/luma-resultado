import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import BaseAmount from '../../src/components/atoms/BaseAmount.vue';
import BaseBadge from '../../src/components/atoms/BaseBadge.vue';
import BaseSpinner from '../../src/components/atoms/BaseSpinner.vue';
import MaskedNumber from '../../src/components/atoms/MaskedNumber.vue';
import AccountCard from '../../src/components/molecules/AccountCard.vue';
import AccountTypeFilter from '../../src/components/molecules/AccountTypeFilter.vue';
import StatusMessage from '../../src/components/molecules/StatusMessage.vue';
import { fixtureAccounts } from '../../src/fixtures/accounts';

describe('atoms', () => {
  it('BaseAmount formats minor units using the given locale', () => {
    const wrapper = mount(BaseAmount, {
      props: { amountMinor: 123456, currency: 'USD', locale: 'en-US' },
    });
    expect(wrapper.text()).toContain('1,234.56');
  });

  it('BaseAmount marks negative amounts', () => {
    const wrapper = mount(BaseAmount, {
      props: { amountMinor: -500, currency: 'USD', locale: 'en-US' },
    });
    expect(wrapper.classes()).toContain('amount--negative');
  });

  it('BaseAmount falls back to a dash when the data is invalid', () => {
    const wrapper = mount(BaseAmount, { props: { amountMinor: 1.5, currency: 'USD' } });
    expect(wrapper.text()).toBe('—');
  });

  it('MaskedNumber never renders the full number', () => {
    const wrapper = mount(MaskedNumber, { props: { number: '0001234567891234' } });
    expect(wrapper.html()).not.toContain('0001234567891234');
    expect(wrapper.text()).toContain('•••• 1234');
    expect(wrapper.text()).toContain('terminada en 1234');
  });

  it('BaseBadge renders its label with the tone class', () => {
    const wrapper = mount(BaseBadge, { props: { label: 'Activa', tone: 'success' } });
    expect(wrapper.text()).toBe('Activa');
    expect(wrapper.classes()).toContain('badge--success');
  });

  it('BaseSpinner is hidden from assistive technology', () => {
    const wrapper = mount(BaseSpinner);
    expect(wrapper.attributes('aria-hidden')).toBe('true');
  });
});

describe('molecules', () => {
  const account = fixtureAccounts[0];

  it('AccountCard shows alias, masked number and never the full number', () => {
    const wrapper = mount(AccountCard, { props: { account } });
    expect(wrapper.text()).toContain(account.alias);
    expect(wrapper.text()).toContain('•••• 1234');
    expect(wrapper.html()).not.toContain(account.number);
  });

  it('AccountCard emits select with the account id when clicked', async () => {
    const wrapper = mount(AccountCard, { props: { account } });
    await wrapper.get('button').trigger('click');
    expect(wrapper.emitted('select')).toEqual([[account.id]]);
  });

  it('AccountCard exposes the selected state via aria-pressed', () => {
    const wrapper = mount(AccountCard, { props: { account, selected: true } });
    expect(wrapper.get('button').attributes('aria-pressed')).toBe('true');
  });

  it('AccountTypeFilter has an associated label and emits the chosen value', async () => {
    const wrapper = mount(AccountTypeFilter, { props: { modelValue: 'ALL' } });
    expect(wrapper.get('label').attributes('for')).toBe(wrapper.get('select').attributes('id'));
    await wrapper.get('select').setValue('SAVINGS');
    expect(wrapper.emitted('update:modelValue')).toEqual([['SAVINGS']]);
  });

  it('StatusMessage uses role=alert for errors and offers a retry', async () => {
    const wrapper = mount(StatusMessage, { props: { kind: 'error', message: 'Falló' } });
    expect(wrapper.attributes('role')).toBe('alert');
    await wrapper.get('button').trigger('click');
    expect(wrapper.emitted('retry')).toHaveLength(1);
  });

  it('StatusMessage uses role=status for loading and shows the spinner', () => {
    const wrapper = mount(StatusMessage, { props: { kind: 'loading', message: 'Cargando' } });
    expect(wrapper.attributes('role')).toBe('status');
    expect(wrapper.find('[data-testid="spinner"]').exists()).toBe(true);
    expect(wrapper.find('button').exists()).toBe(false);
  });

  it('StatusMessage for empty has no retry button', () => {
    const wrapper = mount(StatusMessage, { props: { kind: 'empty', message: 'Vacío' } });
    expect(wrapper.find('button').exists()).toBe(false);
  });
});
