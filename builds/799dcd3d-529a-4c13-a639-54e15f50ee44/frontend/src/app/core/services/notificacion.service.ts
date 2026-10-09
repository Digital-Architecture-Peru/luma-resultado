import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { API_BASE_URL } from '../api-config';
import { FiltroNotificaciones, Notificacion, Pagina } from '../models/notificacion.model';

@Injectable({ providedIn: 'root' })
export class NotificacionService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = inject(API_BASE_URL);

  listar(tarjetaId: string, filtro: FiltroNotificaciones = {}): Observable<Pagina<Notificacion>> {
    let params = new HttpParams();
    if (filtro.leida !== undefined) {
      params = params.set('leida', String(filtro.leida));
    }
    if (filtro.page !== undefined) {
      params = params.set('page', String(filtro.page));
    }
    if (filtro.size !== undefined) {
      params = params.set('size', String(filtro.size));
    }
    const url = `${this.baseUrl}/tarjetas/${encodeURIComponent(tarjetaId)}/notificaciones`;
    return this.http.get<Pagina<Notificacion>>(url, { params });
  }

  marcarLeida(id: number): Observable<Notificacion> {
    return this.http.patch<Notificacion>(`${this.baseUrl}/notificaciones/${id}/leida`, {});
  }
}
