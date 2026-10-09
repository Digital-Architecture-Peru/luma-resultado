import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, InjectionToken, inject } from '@angular/core';
import { Observable, map } from 'rxjs';
import {
  ResultadoTransaccion,
  SolicitudTransaccion,
  Tarjeta,
  Transaccion,
} from '../models/transaccion.model';

export const API_BASE = new InjectionToken<string>('API_BASE', {
  providedIn: 'root',
  factory: () => '/api',
});

/** Cliente demo: en producción lo resuelve Banca por Internet (SSO/gateway). */
export const CLIENTE_DEMO = new InjectionToken<string>('CLIENTE_DEMO', {
  providedIn: 'root',
  factory: () => 'cli-001',
});

@Injectable({ providedIn: 'root' })
export class TransaccionApiService {
  private readonly http = inject(HttpClient);
  private readonly base = inject(API_BASE);
  private readonly cliente = inject(CLIENTE_DEMO);

  listarTarjetas(): Observable<Tarjeta[]> {
    return this.http.get<Tarjeta[]>(`${this.base}/tarjetas`, { headers: this.cabeceras() });
  }

  historial(tarjetaId: number, limite = 20): Observable<Transaccion[]> {
    return this.http.get<Transaccion[]>(`${this.base}/tarjetas/${tarjetaId}/transacciones`, {
      headers: this.cabeceras(),
      params: { limite },
    });
  }

  registrar(
    tarjetaId: number,
    solicitud: SolicitudTransaccion,
    idempotencyKey: string,
  ): Observable<ResultadoTransaccion> {
    const headers = this.cabeceras().set('Idempotency-Key', idempotencyKey);
    return this.http
      .post<Transaccion>(`${this.base}/tarjetas/${tarjetaId}/transacciones`, solicitud, {
        headers,
        observe: 'response',
      })
      .pipe(
        map((resp) => {
          if (resp.body === null) {
            throw new Error('Respuesta sin contenido');
          }
          return { transaccion: resp.body, repetida: resp.status === 200 };
        }),
      );
  }

  private cabeceras(): HttpHeaders {
    return new HttpHeaders({ 'X-Cliente-Id': this.cliente });
  }
}
