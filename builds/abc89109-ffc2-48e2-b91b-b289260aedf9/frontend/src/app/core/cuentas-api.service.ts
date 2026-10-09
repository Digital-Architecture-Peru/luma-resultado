import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CuentaResumen } from './cuenta.model';

export const API_CUENTAS = '/api/v1/cuentas';

@Injectable({ providedIn: 'root' })
export class CuentasApiService {
  private readonly http = inject(HttpClient);

  listar(clienteId: string): Observable<CuentaResumen[]> {
    const params = new HttpParams().set('clienteId', clienteId);
    return this.http.get<CuentaResumen[]>(API_CUENTAS, { params });
  }
}
