import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { Account, Payment, PaymentRequest } from '../models/payment.models';

const BASE_URL = '/api/v1';

@Injectable({ providedIn: 'root' })
export class PaymentApiService {
  private readonly http = inject(HttpClient);

  accounts(): Observable<Account[]> {
    return this.http.get<Account[]>(`${BASE_URL}/accounts`);
  }

  create(request: PaymentRequest, idempotencyKey: string): Observable<Payment> {
    return this.http.post<Payment>(`${BASE_URL}/payments`, request, {
      headers: { 'Idempotency-Key': idempotencyKey },
    });
  }

  get(id: string): Observable<Payment> {
    return this.http.get<Payment>(`${BASE_URL}/payments/${encodeURIComponent(id)}`);
  }
}
