import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { Transfer, TransferRequest } from './models';

@Injectable({ providedIn: 'root' })
export class TransferService {
  private readonly http = inject(HttpClient);

  create(request: TransferRequest, idempotencyKey: string): Observable<Transfer> {
    const headers = new HttpHeaders({ 'Idempotency-Key': idempotencyKey });
    return this.http.post<Transfer>('/api/v1/transfers', request, { headers });
  }
}
