import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable, InjectionToken, inject } from '@angular/core';
import { Observable, map } from 'rxjs';
import { FiltroNotificaciones, PaginaNotificaciones, Preferencia } from './models';

const URL_POR_DEFECTO = 'http://localhost:5080';

export const API_BASE_URL = new InjectionToken<string>('API_BASE_URL', {
  providedIn: 'root',
  factory: () => (globalThis as { API_BASE_URL?: string }).API_BASE_URL ?? URL_POR_DEFECTO
});

/** Cliente ficticio: la autenticación real la aporta el gateway de Banca por Internet. */
export const CLIENTE_DEMO = 'cliente-demo';

interface PreferenciasRespuesta {
  preferencias: Preferencia[];
}

@Injectable({ providedIn: 'root' })
export class NotificacionesService {
  private readonly http = inject(HttpClient);
  private readonly base = `${inject(API_BASE_URL)}/api/v1`;
  private readonly headers = new HttpHeaders({ 'X-Cliente-Id': CLIENTE_DEMO });

  listar(tarjetaRef: string, filtro: FiltroNotificaciones = {}): Observable<PaginaNotificaciones> {
    let params = new HttpParams();
    if (filtro.leida !== undefined) params = params.set('leida', String(filtro.leida));
    if (filtro.page !== undefined) params = params.set('page', filtro.page);
    if (filtro.size !== undefined) params = params.set('size', filtro.size);
    return this.http.get<PaginaNotificaciones>(
      `${this.base}/tarjetas/${encodeURIComponent(tarjetaRef)}/notificaciones`,
      { headers: this.headers, params }
    );
  }

  marcarLeida(id: string): Observable<void> {
    return this.http.patch<void>(
      `${this.base}/notificaciones/${encodeURIComponent(id)}/lectura`, null, { headers: this.headers });
  }

  obtenerPreferencias(tarjetaRef: string): Observable<Preferencia[]> {
    return this.http
      .get<PreferenciasRespuesta>(this.urlPreferencias(tarjetaRef), { headers: this.headers })
      .pipe(map(r => r.preferencias));
  }

  guardarPreferencias(tarjetaRef: string, preferencias: Preferencia[]): Observable<Preferencia[]> {
    return this.http
      .put<PreferenciasRespuesta>(this.urlPreferencias(tarjetaRef), { preferencias }, { headers: this.headers })
      .pipe(map(r => r.preferencias));
  }

  private urlPreferencias(tarjetaRef: string): string {
    return `${this.base}/tarjetas/${encodeURIComponent(tarjetaRef)}/preferencias`;
  }
}
