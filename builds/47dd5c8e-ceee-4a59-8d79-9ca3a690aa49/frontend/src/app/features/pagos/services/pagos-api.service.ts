import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { FiltroPagos, Pagina, Pago } from '../models/pago.model';

@Injectable({ providedIn: 'root' })
export class PagosApiService {
  private readonly http = inject(HttpClient);
  private readonly base = `${environment.apiBaseUrl}/pagos`;

  listar(filtro: FiltroPagos, page: number, size: number): Observable<Pagina<Pago>> {
    let params = new HttpParams().set('page', page).set('size', size);
    if (filtro.estado) {
      params = params.set('estado', filtro.estado);
    }
    if (filtro.desde) {
      params = params.set('desde', filtro.desde);
    }
    if (filtro.hasta) {
      params = params.set('hasta', filtro.hasta);
    }
    return this.http.get<Pagina<Pago>>(this.base, { params, headers: this.headers() });
  }

  private headers(): HttpHeaders {
    return new HttpHeaders({ 'X-Cliente-Id': environment.clienteIdSimulado });
  }
}
