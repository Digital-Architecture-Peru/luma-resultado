import { InMemoryCustomersRepository } from './in-memory-customers.repository';
import { CustomerNotFoundError, DuplicateEmailError } from './customers.repository';
import { FAKE_CUSTOMERS } from '../../../../testing/fixtures/customers.fixture';

describe('InMemoryCustomersRepository', () => {
  let repo: InMemoryCustomersRepository;
  const draft = { name: 'Dani Nuevo', email: 'dani@example.com', phone: '+00 222 000 000', city: 'Ciudad Tres' };

  beforeEach(() => {
    repo = new InMemoryCustomersRepository(FAKE_CUSTOMERS);
  });

  it('given seed data when list then returns all customers', async () => {
    expect((await repo.list()).length).toBe(FAKE_CUSTOMERS.length);
  });

  it('given a draft when create then assigns id and is listed', async () => {
    const created = await repo.create(draft);
    expect(created.id).toBeTruthy();
    expect((await repo.get(created.id))?.name).toBe('Dani Nuevo');
    expect((await repo.list()).length).toBe(FAKE_CUSTOMERS.length + 1);
  });

  it('given an existing email when create then rejects (case-insensitive)', async () => {
    await expectAsync(repo.create({ ...draft, email: 'ANA@example.com' })).toBeRejectedWithError(DuplicateEmailError);
  });

  it('given a customer when update then persists changes', async () => {
    const updated = await repo.update('c-1', { ...draft, email: 'ana@example.com', name: 'Ana Editada' });
    expect(updated.name).toBe('Ana Editada');
    expect((await repo.get('c-1'))?.name).toBe('Ana Editada');
  });

  it('given another customer email when update then rejects', async () => {
    await expectAsync(repo.update('c-1', { ...draft, email: 'beto@example.com' })).toBeRejectedWithError(DuplicateEmailError);
  });

  it('given unknown id when update or remove then rejects with not found', async () => {
    await expectAsync(repo.update('nope', draft)).toBeRejectedWithError(CustomerNotFoundError);
    await expectAsync(repo.remove('nope')).toBeRejectedWithError(CustomerNotFoundError);
  });

  it('given a customer when remove then it disappears', async () => {
    await repo.remove('c-2');
    expect(await repo.get('c-2')).toBeUndefined();
  });

  it('given returned objects when mutated then internal state is unchanged', async () => {
    const list = await repo.list();
    list[0].name = 'MUTADO';
    expect((await repo.get('c-1'))?.name).toBe('Ana Ejemplo');
  });
});
