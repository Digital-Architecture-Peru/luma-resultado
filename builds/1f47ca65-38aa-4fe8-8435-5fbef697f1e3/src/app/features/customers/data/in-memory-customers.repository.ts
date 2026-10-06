import { Customer, CustomerDraft } from '../models/customer.model';
import {
  CustomerNotFoundError,
  CustomersRepository,
  DuplicateEmailError,
} from './customers.repository';

/** Persistencia en memoria (se pierde al recargar). Semilla opcional con datos ficticios. */
export class InMemoryCustomersRepository implements CustomersRepository {
  private items: Customer[];
  private seq: number;

  constructor(seed: readonly Customer[] = []) {
    this.items = seed.map((c) => ({ ...c }));
    this.seq = this.items.length;
  }

  async list(): Promise<Customer[]> {
    return this.items.map((c) => ({ ...c }));
  }

  async get(id: string): Promise<Customer | undefined> {
    const found = this.items.find((c) => c.id === id);
    return found ? { ...found } : undefined;
  }

  async create(draft: CustomerDraft): Promise<Customer> {
    this.assertUniqueEmail(draft.email);
    this.seq += 1;
    const customer: Customer = {
      ...draft,
      id: `c-${this.seq}-${Date.now().toString(36)}`,
      createdAt: new Date().toISOString(),
    };
    this.items.push(customer);
    return { ...customer };
  }

  async update(id: string, draft: CustomerDraft): Promise<Customer> {
    const idx = this.items.findIndex((c) => c.id === id);
    if (idx < 0) throw new CustomerNotFoundError(id);
    this.assertUniqueEmail(draft.email, id);
    this.items[idx] = { ...this.items[idx], ...draft };
    return { ...this.items[idx] };
  }

  async remove(id: string): Promise<void> {
    const idx = this.items.findIndex((c) => c.id === id);
    if (idx < 0) throw new CustomerNotFoundError(id);
    this.items.splice(idx, 1);
  }

  private assertUniqueEmail(email: string, exceptId?: string): void {
    const normalized = email.trim().toLowerCase();
    if (this.items.some((c) => c.id !== exceptId && c.email.toLowerCase() === normalized)) {
      throw new DuplicateEmailError(email);
    }
  }
}
