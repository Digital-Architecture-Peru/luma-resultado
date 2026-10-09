import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, InjectionToken, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { Pago, PagoRequest } from '../pago.model';

export const API_BASE_URL = new InjectionToken<string>('API_BASE_URL', {
  providedIn: 'root',
  factory: () => '/api/v1',
});

@Injectable({ providedIn: 'root' })
export class PagosApiService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = inject(API_BASE_URL);

  crear(solicitud: PagoRequest, idempotencyKey: string): Observable<Pago> {
    return this.http.post<Pago>(`${this.baseUrl}/pagos`, solicitud, {
      headers: { 'Idempotency-Key': idempotencyKey },
    });
  }

  obtener(id: string): Observable<Pago> {
    return this.http.get<Pago>(`${this.baseUrl}/pagos/${encodeURIComponent(id)}`);
  }

  listar(cuentaOrigen: string): Observable<Pago[]> {
    const params = new HttpParams().set('cuentaOrigen', cuentaOrigen);
    return this.http.get<Pago[]>(`${this.baseUrl}/pagos`, { params });
  }
}
