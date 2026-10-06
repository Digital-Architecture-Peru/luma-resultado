import { TestBed } from '@angular/core/testing';
import { CustomersStore } from './customers.store';
import { CUSTOMERS_REPOSITORY, CustomersRepository } from '../data/customers.repository';
import { InMemoryCustomersRepository } from '../data/in-memory-customers.repository';
import { FAKE_CUSTOMERS } from '../../../../testing/fixtures/customers.fixture';

describe('CustomersStore', () => {
  let store: CustomersStore;

  function setup(repo: CustomersRepository = new InMemoryCustomersRepository(FAKE_CUSTOMERS)) {
    TestBed.configureTestingModule({ providers: [{ provide: CUSTOMERS_REPOSITORY, useValue: repo }] });
    store = TestBed.inject(CustomersStore);
  }

  it('given repository data when load then exposes customers and stops loading', async () => {
    setup();
    await store.load();
    expect(store.customers().length).toBe(3);
    expect(store.loading()).toBeFalse();
    expect(store.error()).toBeNull();
  });

  it('given a failing repository when load then sets error message', async () => {
    const failing = new InMemoryCustomersRepository();
    spyOn(failing, 'list').and.rejectWith(new Error('boom'));
    setup(failing);
    await store.load();
    expect(store.error()).toBe('boom');
    expect(store.loading()).toBeFalse();
  });

  it('given a query when searching then filters ignoring case and accents', async () => {
    setup();
    await store.load();
    store.setQuery('CIUDAD uno');
    expect(store.filtered().map((c) => c.id)).toEqual(['c-1', 'c-3']);
    store.setQuery('beto@');
    expect(store.filtered().map((c) => c.id)).toEqual(['c-2']);
    store.setQuery('zzz');
    expect(store.filtered()).toEqual([]);
    store.setQuery('');
    expect(store.filtered().length).toBe(3);
  });

  it('given a draft with spaces when create then trims and adds to list', async () => {
    setup();
    await store.load();
    const created = await store.create({ name: '  Eva Alta ', email: ' eva@example.com ', phone: '1234567', city: ' X ' });
    expect(created.name).toBe('Eva Alta');
    expect(created.email).toBe('eva@example.com');
    expect(store.customers().length).toBe(4);
  });

  it('given duplicate email when create then rejects and list is unchanged', async () => {
    setup();
    await store.load();
    await expectAsync(
      store.create({ name: 'Otra', email: 'ana@example.com', phone: '1234567', city: 'X' }),
    ).toBeRejected();
    expect(store.customers().length).toBe(3);
  });

  it('given a customer when update then list reflects change', async () => {
    setup();
    await store.load();
    await store.update('c-3', { name: 'Carla Cambiada', email: 'carla@example.com', phone: '1234567', city: 'Y' });
    expect(store.customers().find((c) => c.id === 'c-3')?.name).toBe('Carla Cambiada');
  });

  it('given a customer when remove then it is gone; unknown id sets error', async () => {
    setup();
    await store.load();
    expect(await store.remove('c-1')).toBeTrue();
    expect(store.customers().some((c) => c.id === 'c-1')).toBeFalse();
    expect(await store.remove('nope')).toBeFalse();
    expect(store.error()).toContain('nope');
  });
});
