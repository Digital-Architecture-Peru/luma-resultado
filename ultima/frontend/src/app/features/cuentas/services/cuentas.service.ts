import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { Cuenta } from '../models/cuenta.model';

/** Cliente simulado. PENDIENTE: reemplazar por la identidad real (OIDC). */
export const CLIENTE_DEMO_ID = '1';
export const API_CUENTAS = '/api/v1/cuentas';

/** Único punto de acceso a la API de cuentas. */
@Injectable({ providedIn: 'root' })
export class CuentasService {
  private readonly http = inject(HttpClient);

  listar(): Observable<Cuenta[]> {
    return this.http.get<Cuenta[]>(API_CUENTAS, { headers: this.cabeceras() });
  }

  private cabeceras(): HttpHeaders {
    return new HttpHeaders({ 'X-Cliente-Id': CLIENTE_DEMO_ID });
  }
}
