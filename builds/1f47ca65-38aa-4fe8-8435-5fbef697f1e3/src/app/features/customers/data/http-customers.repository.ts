import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { Customer, CustomerDraft } from '../models/customer.model';
import { CustomersRepository } from './customers.repository';

/**
 * Adaptador HTTP candidate (no verificado, no usado por defecto).
 * Asume una API REST ficticia: GET/POST /customers, GET/PUT/DELETE /customers/:id.
 */
export class HttpCustomersRepository implements CustomersRepository {
  constructor(private readonly http: HttpClient, private readonly baseUrl: string) {}

  list(): Promise<Customer[]> {
    return firstValueFrom(this.http.get<Customer[]>(`${this.baseUrl}/customers`));
  }

  async get(id: string): Promise<Customer | undefined> {
    try {
      return await firstValueFrom(
        this.http.get<Customer>(`${this.baseUrl}/customers/${encodeURIComponent(id)}`),
      );
    } catch (e) {
      if ((e as { status?: number }).status === 404) return undefined;
      throw e;
    }
  }

  create(draft: CustomerDraft): Promise<Customer> {
    return firstValueFrom(this.http.post<Customer>(`${this.baseUrl}/customers`, draft));
  }

  update(id: string, draft: CustomerDraft): Promise<Customer> {
    return firstValueFrom(
      this.http.put<Customer>(`${this.baseUrl}/customers/${encodeURIComponent(id)}`, draft),
    );
  }

  async remove(id: string): Promise<void> {
    await firstValueFrom(this.http.delete<void>(`${this.baseUrl}/customers/${encodeURIComponent(id)}`));
  }
}
