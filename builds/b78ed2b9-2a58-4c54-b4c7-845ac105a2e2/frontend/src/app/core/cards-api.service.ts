import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable, InjectionToken, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { Card, CardTransaction, PaymentRequest } from './models';

export const API_BASE_URL = new InjectionToken<string>('API_BASE_URL');

@Injectable({ providedIn: 'root' })
export class CardsApiService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = inject(API_BASE_URL);

  listCards(): Observable<Card[]> {
    return this.http.get<Card[]>(`${this.baseUrl}/cards`);
  }

  listTransactions(cardId: string, page = 1): Observable<CardTransaction[]> {
    const params = new HttpParams().set('page', page);
    return this.http.get<CardTransaction[]>(`${this.baseUrl}/cards/${cardId}/transactions`, { params });
  }

  pay(cardId: string, request: PaymentRequest, idempotencyKey: string): Observable<CardTransaction> {
    const headers = new HttpHeaders({ 'Idempotency-Key': idempotencyKey });
    return this.http.post<CardTransaction>(`${this.baseUrl}/cards/${cardId}/payments`, request, { headers });
  }
}
