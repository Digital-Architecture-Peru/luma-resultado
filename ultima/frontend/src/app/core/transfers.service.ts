import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { API_BASE_URL } from './api-config';
import { TransferRequest, TransferResponse } from './models';

@Injectable({ providedIn: 'root' })
export class TransfersService {
  constructor(
    private readonly http: HttpClient,
    @Inject(API_BASE_URL) private readonly baseUrl: string,
  ) {}

  create(request: TransferRequest, idempotencyKey: string): Observable<TransferResponse> {
    return this.http.post<TransferResponse>(`${this.baseUrl}/transfers`, request, {
      headers: { 'Idempotency-Key': idempotencyKey },
    });
  }
}
