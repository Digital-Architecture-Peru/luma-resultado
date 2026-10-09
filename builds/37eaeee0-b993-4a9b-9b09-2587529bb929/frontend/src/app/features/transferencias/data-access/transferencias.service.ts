import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, InjectionToken, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { Comprobante, Cuenta, TransferenciaSolicitud } from './models';

/** Base de la API; por defecto relativa (proxy en desarrollo o reverse proxy en despliegue). */
export const API_BASE_URL = new InjectionToken<string>('API_BASE_URL', {
  providedIn: 'root',
  factory: () => '/api/v1',
});

@Injectable({ providedIn: 'root' })
export class TransferenciasService {
  private readonly http = inject(HttpClient);
  private readonly base = inject(API_BASE_URL);

  listarCuentas(): Observable<Cuenta[]> {
    return this.http.get<Cuenta[]>(`${this.base}/cuentas`);
  }

  transferir(solicitud: TransferenciaSolicitud, idempotencyKey: string): Observable<Comprobante> {
    const headers = new HttpHeaders({ 'Idempotency-Key': idempotencyKey });
    return this.http.post<Comprobante>(`${this.base}/transferencias`, solicitud, { headers });
  }
}
