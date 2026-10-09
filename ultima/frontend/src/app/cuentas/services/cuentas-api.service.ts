import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Cuenta, PaginaCuentas } from '../models/cuenta.model';

/** Único punto de acceso HTTP a la API de cuentas. */
@Injectable({ providedIn: 'root' })
export class CuentasApiService {
  private readonly http = inject(HttpClient);
  private readonly base = `${environment.apiBaseUrl}/cuentas`;

  listar(pagina = 0, tamanio = 20): Observable<PaginaCuentas> {
    const params = new HttpParams().set('pagina', pagina).set('tamanio', tamanio);
    return this.http.get<PaginaCuentas>(this.base, { params, headers: this.cabeceras() });
  }

  obtener(id: string): Observable<Cuenta> {
    return this.http.get<Cuenta>(`${this.base}/${encodeURIComponent(id)}`, { headers: this.cabeceras() });
  }

  private cabeceras(): HttpHeaders {
    return new HttpHeaders({ 'X-Cliente-Id': environment.clienteId });
  }
}
