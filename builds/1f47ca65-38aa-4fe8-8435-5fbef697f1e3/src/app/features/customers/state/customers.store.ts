import { Injectable, computed, inject, signal } from '@angular/core';
import { Customer, CustomerDraft } from '../models/customer.model';
import { CUSTOMERS_REPOSITORY } from '../data/customers.repository';

function normalize(text: string): string {
  return text.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim();
}

@Injectable({ providedIn: 'root' })
export class CustomersStore {
  private readonly repo = inject(CUSTOMERS_REPOSITORY);

  private readonly _customers = signal<Customer[]>([]);
  private readonly _query = signal('');
  private readonly _loading = signal(false);
  private readonly _error = signal<string | null>(null);

  readonly customers = this._customers.asReadonly();
  readonly query = this._query.asReadonly();
  readonly loading = this._loading.asReadonly();
  readonly error = this._error.asReadonly();

  /** Búsqueda por nombre, correo, teléfono o ciudad (sin distinguir mayúsculas ni acentos). */
  readonly filtered = computed(() => {
    const q = normalize(this._query());
    const all = this._customers();
    if (!q) return all;
    return all.filter((c) =>
      normalize(`${c.name} ${c.email} ${c.phone} ${c.city}`).includes(q),
    );
  });

  setQuery(value: string): void {
    this._query.set(value);
  }

  async load(): Promise<void> {
    this._loading.set(true);
    this._error.set(null);
    try {
      this._customers.set(await this.repo.list());
    } catch (e) {
      this._error.set(this.message(e, 'No se pudo cargar la lista de clientes.'));
    } finally {
      this._loading.set(false);
    }
  }

  getById(id: string): Promise<Customer | undefined> {
    return this.repo.get(id);
  }

  /** Lanza el error al llamador (formulario) para mostrarlo junto a los campos. */
  async create(draft: CustomerDraft): Promise<Customer> {
    const created = await this.repo.create(this.clean(draft));
    this._customers.update((list) => [...list, created]);
    return created;
  }

  async update(id: string, draft: CustomerDraft): Promise<Customer> {
    const updated = await this.repo.update(id, this.clean(draft));
    this._customers.update((list) => list.map((c) => (c.id === id ? updated : c)));
    return updated;
  }

  async remove(id: string): Promise<boolean> {
    this._error.set(null);
    try {
      await this.repo.remove(id);
      this._customers.update((list) => list.filter((c) => c.id !== id));
      return true;
    } catch (e) {
      this._error.set(this.message(e, 'No se pudo eliminar el cliente.'));
      return false;
    }
  }

  private clean(d: CustomerDraft): CustomerDraft {
    return {
      name: d.name.trim(),
      email: d.email.trim(),
      phone: d.phone.trim(),
      city: d.city.trim(),
    };
  }

  private message(e: unknown, fallback: string): string {
    return e instanceof Error && e.message ? e.message : fallback;
  }
}
