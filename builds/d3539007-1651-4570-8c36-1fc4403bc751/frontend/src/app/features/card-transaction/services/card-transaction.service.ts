import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {
  CardView,
  CreateTransactionRequest,
  TransactionCreated,
  TransactionPage,
} from '../models/card-transaction.models';

@Injectable({ providedIn: 'root' })
export class CardTransactionService {
  private readonly baseUrl = '/api/v1/cards';

  constructor(private readonly http: HttpClient) {}

  listCards(): Observable<CardView[]> {
    return this.http.get<CardView[]>(this.baseUrl);
  }

  createTransaction(
    cardId: string,
    request: CreateTransactionRequest,
    idempotencyKey: string,
  ): Observable<TransactionCreated> {
    const headers = new HttpHeaders({ 'Idempotency-Key': idempotencyKey });
    return this.http.post<TransactionCreated>(`${this.baseUrl}/${cardId}/transactions`, request, { headers });
  }

  history(cardId: string, page = 0, size = 10): Observable<TransactionPage> {
    return this.http.get<TransactionPage>(`${this.baseUrl}/${cardId}/transactions`, {
      params: { page, size },
    });
  }
}
