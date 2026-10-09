import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { FiltroPagos, PaginaPagos } from './pago.model';

@Injectable({ providedIn: 'root' })
export class PagosApiService {
  private readonly http = inject(HttpClient);

  consultar(filtro: FiltroPagos): Observable<PaginaPagos> {
    let params = new HttpParams().set('page', filtro.page).set('size', filtro.size);
    if (filtro.desde) params = params.set('desde', `${filtro.desde}T00:00:00Z`);
    if (filtro.hasta) params = params.set('hasta', `${filtro.hasta}T23:59:59Z`);
    if (filtro.estado) params = params.set('estado', filtro.estado);

    return this.http.get<PaginaPagos>(`${environment.apiBaseUrl}/pagos`, { params });
  }
}
