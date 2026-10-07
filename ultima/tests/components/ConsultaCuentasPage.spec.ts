import { flushPromises, mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import ConsultaCuentasPage from '../../src/components/pages/ConsultaCuentasPage.vue';
import { LIST_ERROR_MESSAGE } from '../../src/composables/useAccounts';
import { fixtureAccounts } from '../../src/fixtures/accounts';
import type { AccountRepository } from '../../src/ports/AccountRepository';
import { AccountRepositoryKey } from '../../src/ports/keys';
import { makeRepository } from '../helpers/fakeRepository';

function mountPage(repository: AccountRepository) {
  return mount(ConsultaCuentasPage, {
    global: { provide: { [AccountRepositoryKey as symbol]: repository } },
  });
}

describe('ConsultaCuentasPage', () => {
  it('state loading: shows a status message while the list is pending', async () => {
    const wrapper = mountPage(makeRepository({ list: () => new Promise(() => {}) }));
    await flushPromises();
    expect(wrapper.get('[data-testid="status-message"]').text()).toContain('Cargando cuentas');
    expect(wrapper.find('[data-testid="account-card"]').exists()).toBe(false);
  });

  it('state success: lists the accounts with masked numbers only', async () => {
    const wrapper = mountPage(makeRepository());
    await flushPromises();
    expect(wrapper.findAll('[data-testid="account-card"]')).toHaveLength(fixtureAccounts.length);
    expect(wrapper.text()).toContain(`${fixtureAccounts.length} cuenta(s) encontrada(s)`);
    for (const account of fixtureAccounts) {
      expect(wrapper.html()).not.toContain(account.number);
    }
  });

  it('state empty: shows an empty message when there are no accounts', async () => {
    const wrapper = mountPage(makeRepository({ list: async () => [] }));
    await flushPromises();
    expect(wrapper.text()).toContain('No se encontraron cuentas');
    expect(wrapper.find('[data-testid="account-card"]').exists()).toBe(false);
  });

  it('state error: announces the error and recovers after retry', async () => {
    let calls = 0;
    const wrapper = mountPage(
      makeRepository({
        list: async () => {
          calls += 1;
          if (calls === 1) throw new Error('fallo de red');
          return [...fixtureAccounts];
        },
      }),
    );
    await flushPromises();
    const alert = wrapper.get('[role="alert"]');
    expect(alert.text()).toContain(LIST_ERROR_MESSAGE);
    expect(alert.text()).not.toContain('fallo de red');

    await alert.get('button').trigger('click');
    await flushPromises();
    expect(wrapper.find('[role="alert"]').exists()).toBe(false);
    expect(wrapper.findAll('[data-testid="account-card"]')).toHaveLength(fixtureAccounts.length);
  });

  it('filter: choosing a type reloads and shows only that type', async () => {
    const wrapper = mountPage(makeRepository());
    await flushPromises();
    await wrapper.get('select').setValue('TERM_DEPOSIT');
    await flushPromises();
    const expected = fixtureAccounts.filter((a) => a.type === 'TERM_DEPOSIT');
    expect(wrapper.findAll('[data-testid="account-card"]')).toHaveLength(expected.length);
    expect(wrapper.text()).toContain('Depósito a plazo');
  });

  it('detail: clicking a card shows its detail and closing hides it', async () => {
    const wrapper = mountPage(makeRepository());
    await flushPromises();
    expect(wrapper.get('[data-testid="detail-panel"]').text()).toContain('Seleccione una cuenta');

    await wrapper.findAll('[data-testid="account-card"] button')[0].trigger('click');
    await flushPromises();
    const panel = wrapper.get('[data-testid="detail-panel"]');
    expect(panel.text()).toContain('Saldo disponible');
    expect(panel.text()).toContain(fixtureAccounts[0].holderName);

    const close = panel.findAll('button').find((b) => b.text() === 'Cerrar detalle');
    expect(close).toBeDefined();
    await close!.trigger('click');
    expect(wrapper.get('[data-testid="detail-panel"]').text()).toContain('Seleccione una cuenta');
  });

  it('detail: a failing getById shows an error without breaking the list', async () => {
    const wrapper = mountPage(
      makeRepository({ getById: async () => Promise.reject(new Error('x')) }),
    );
    await flushPromises();
    await wrapper.findAll('[data-testid="account-card"] button')[0].trigger('click');
    await flushPromises();
    expect(wrapper.get('[data-testid="detail-panel"] [role="alert"]').exists()).toBe(true);
    expect(wrapper.findAll('[data-testid="account-card"]')).toHaveLength(fixtureAccounts.length);
  });

  it('page exposes a main landmark with the h1 title', async () => {
    const wrapper = mountPage(makeRepository());
    await flushPromises();
    expect(wrapper.get('main h1').text()).toBe('Consulta de cuentas');
  });

  it('throws a clear error if the repository was not provided', () => {
    expect(() => mount(ConsultaCuentasPage)).toThrow(/AccountRepository no provisto/);
  });
});
