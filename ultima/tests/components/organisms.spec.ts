import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import AccountDetailPanel from '../../src/components/organisms/AccountDetailPanel.vue';
import AccountList from '../../src/components/organisms/AccountList.vue';
import { fixtureAccounts } from '../../src/fixtures/accounts';

describe('AccountList', () => {
  it('given N accounts, when rendered, then it shows N cards', () => {
    const wrapper = mount(AccountList, { props: { accounts: fixtureAccounts, selectedId: null } });
    expect(wrapper.findAll('[data-testid="account-card"]')).toHaveLength(fixtureAccounts.length);
  });

  it('given a selectedId, when rendered, then only that card is pressed', () => {
    const wrapper = mount(AccountList, {
      props: { accounts: fixtureAccounts, selectedId: 'acc-002' },
    });
    const pressed = wrapper.findAll('button[aria-pressed="true"]');
    expect(pressed).toHaveLength(1);
    expect(pressed[0].text()).toContain('Cuenta de nómina');
  });

  it('given a click on a card, when clicked, then select is emitted with its id', async () => {
    const wrapper = mount(AccountList, { props: { accounts: fixtureAccounts, selectedId: null } });
    await wrapper.findAll('button')[1].trigger('click');
    expect(wrapper.emitted('select')).toEqual([[fixtureAccounts[1].id]]);
  });

  it('given no accounts, when rendered, then the list is empty', () => {
    const wrapper = mount(AccountList, { props: { accounts: [], selectedId: null } });
    expect(wrapper.findAll('li')).toHaveLength(0);
  });
});

describe('AccountDetailPanel', () => {
  it('given no account, when rendered, then it shows a hint and no close button', () => {
    const wrapper = mount(AccountDetailPanel, { props: { account: null } });
    expect(wrapper.text()).toContain('Seleccione una cuenta');
    expect(wrapper.find('button').exists()).toBe(false);
  });

  it('given an account, when rendered, then balances, status and masked number are shown', () => {
    const account = fixtureAccounts[0];
    const wrapper = mount(AccountDetailPanel, { props: { account } });
    expect(wrapper.text()).toContain('Saldo contable');
    expect(wrapper.text()).toContain('Saldo disponible');
    expect(wrapper.text()).toContain('Activa');
    expect(wrapper.text()).toContain('•••• 1234');
    expect(wrapper.html()).not.toContain(account.number);
  });

  it('given an account, when closing, then close is emitted', async () => {
    const wrapper = mount(AccountDetailPanel, { props: { account: fixtureAccounts[0] } });
    await wrapper.get('button').trigger('click');
    expect(wrapper.emitted('close')).toHaveLength(1);
  });

  it('given loading, when rendered, then a status region is displayed', () => {
    const wrapper = mount(AccountDetailPanel, { props: { account: null, loading: true } });
    expect(wrapper.get('[role="status"]').text()).toContain('Cargando detalle');
  });

  it('given an error, when rendered, then it is announced with role=alert', () => {
    const wrapper = mount(AccountDetailPanel, { props: { account: null, error: 'Falló el detalle' } });
    expect(wrapper.get('[role="alert"]').text()).toBe('Falló el detalle');
  });
});
