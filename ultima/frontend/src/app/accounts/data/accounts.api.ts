import { Injectable, InjectionToken, inject } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Cuenta, Pagina } from './account.model';

/** Base de la API; por defecto usa el proxy de desarrollo. Sobrescribir al desplegar. */
export const API_BASE_URL = new InjectionToken<string>('API_BASE_URL', {
  providedIn: 'root',
  factory: () => '/api/v1'
});

/** Cliente ficticio SOLO para desarrollo (encabezado X-Customer-Id). No apto para producción. */
export const DEV_CUSTOMER_ID = new InjectionToken<string>('DEV_CUSTOMER_ID', {
  providedIn: 'root',
  factory: () => '11111111-1111-4111-8111-111111111111'
});

@Injectable({ providedIn: 'root' })
export class AccountsApi {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = inject(API_BASE_URL);
  private readonly devCustomerId = inject(DEV_CUSTOMER_ID);

  listar(page = 1, size = 10): Observable<Pagina<Cuenta>> {
    const params = new HttpParams().set('page', page).set('size', size);
    return this.http.get<Pagina<Cuenta>>(`${this.baseUrl}/accounts`, { params, headers: this.headers() });
  }

  obtener(id: string): Observable<Cuenta> {
    return this.http.get<Cuenta>(`${this.baseUrl}/accounts/${encodeURIComponent(id)}`, {
      headers: this.headers()
    });
  }

  private headers(): HttpHeaders {
    return new HttpHeaders({ 'X-Customer-Id': this.devCustomerId });
  }
}
