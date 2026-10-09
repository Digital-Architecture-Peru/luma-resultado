import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { FiltroPagos, Pago, Pagina } from './pago.model';

@Injectable({ providedIn: 'root' })
export class PagosApiService {
  private readonly http = inject(HttpClient);
  private readonly base = `${environment.apiBaseUrl}/pagos`;

  listar(filtro: FiltroPagos): Observable<Pagina<Pago>> {
    let params = new HttpParams()
      .set('cuentaId', filtro.cuentaId)
      .set('page', filtro.page)
      .set('size', filtro.size);
    if (filtro.desde) params = params.set('desde', filtro.desde);
    if (filtro.hasta) params = params.set('hasta', filtro.hasta);
    if (filtro.estado) params = params.set('estado', filtro.estado);
    return this.http.get<Pagina<Pago>>(this.base, { params });
  }

  obtener(id: number, cuentaId: string): Observable<Pago> {
    const params = new HttpParams().set('cuentaId', cuentaId);
    return this.http.get<Pago>(`${this.base}/${id}`, { params });
  }
}
