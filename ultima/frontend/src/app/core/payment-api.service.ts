import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Payment, PaymentRequest } from './models';

const BASE_PATH = '/api/v1/payments';

@Injectable({ providedIn: 'root' })
export class PaymentApiService {
  private readonly http = inject(HttpClient);

  create(request: PaymentRequest, idempotencyKey: string): Observable<Payment> {
    return this.http.post<Payment>(`${environment.apiBaseUrl}${BASE_PATH}`, request, {
      headers: {
        'Idempotency-Key': idempotencyKey,
        'X-Customer-Id': environment.customerId
      }
    });
  }

  get(id: string): Observable<Payment> {
    return this.http.get<Payment>(`${environment.apiBaseUrl}${BASE_PATH}/${encodeURIComponent(id)}`, {
      headers: { 'X-Customer-Id': environment.customerId }
    });
  }

  listByAccount(accountId: string): Observable<Payment[]> {
    return this.http.get<Payment[]>(`${environment.apiBaseUrl}${BASE_PATH}`, {
      params: { accountId },
      headers: { 'X-Customer-Id': environment.customerId }
    });
  }
}

/** Traduce un error HTTP en un mensaje para el usuario (el back es la fuente de verdad). */
export function describeError(error: HttpErrorResponse): string {
  if (error.status === 409) {
    return 'Este pago ya fue registrado (clave de idempotencia repetida).';
  }
  if (error.status === 400) {
    const fieldErrors = error.error?.errors as Record<string, string[]> | undefined;
    if (fieldErrors) {
      return Object.values(fieldErrors).flat().join(' ');
    }
    return (error.error?.detail as string | undefined) ?? 'La solicitud no es válida.';
  }
  return 'No fue posible procesar el pago. Intente nuevamente.';
}
