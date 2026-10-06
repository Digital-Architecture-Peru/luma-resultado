import { InjectionToken } from '@angular/core';
import { Customer, CustomerDraft } from '../models/customer.model';

export class DuplicateEmailError extends Error {
  constructor(email: string) {
    super(`Ya existe un cliente con el correo ${email}`);
    this.name = 'DuplicateEmailError';
  }
}

export class CustomerNotFoundError extends Error {
  constructor(id: string) {
    super(`Cliente no encontrado: ${id}`);
    this.name = 'CustomerNotFoundError';
  }
}

/** Contrato de acceso a datos. Se puede sustituir por un adaptador HTTP sin tocar la UI. */
export interface CustomersRepository {
  list(): Promise<Customer[]>;
  get(id: string): Promise<Customer | undefined>;
  create(draft: CustomerDraft): Promise<Customer>;
  update(id: string, draft: CustomerDraft): Promise<Customer>;
  remove(id: string): Promise<void>;
}

export const CUSTOMERS_REPOSITORY = new InjectionToken<CustomersRepository>('CUSTOMERS_REPOSITORY');
