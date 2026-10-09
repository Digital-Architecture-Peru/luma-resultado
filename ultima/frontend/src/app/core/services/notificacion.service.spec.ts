import { HttpClient } from '@angular/common/http';
import { Injector } from '@angular/core';
import { firstValueFrom, of } from 'rxjs';
import { describe, expect, it, vi } from 'vitest';
import { API_BASE_URL } from '../api-config';
import { Notificacion, Pagina } from '../models/notificacion.model';
import { NotificacionService } from './notificacion.service';

const ejemplo: Notificacion = {
  id: 1,
  tarjetaId: 'tarjeta-0001',
  ultimos4: '1111',
  tipo: 'CONSUMO',
  mensaje: 'Consumo ficticio',
  leida: false,
  creadaEn: '2026-01-01T10:00:00Z',
};
const pagina: Pagina<Notificacion> = { items: [ejemplo], page: 0, size: 20, total: 1 };

function crear() {
  const get = vi.fn((_url: string, _opts?: { params: { toString(): string } }) => of(pagina));
  const patch = vi.fn((_url: string, _body: unknown) => of({ ...ejemplo, leida: true }));
  const injector = Injector.create({
    providers: [
      { provide: HttpClient, useValue: { get, patch } as unknown as HttpClient },
      { provide: API_BASE_URL, useValue: '/api/test' },
      { provide: NotificacionService, useClass: NotificacionService, deps: [] },
    ],
  });
  return { servicio: injector.get(NotificacionService), get, patch };
}

describe('NotificacionService', () => {
  it('given filtro completo when listar then arma URL y parámetros', async () => {
    const { servicio, get } = crear();

    const resultado = await firstValueFrom(
      servicio.listar('tarjeta-0001', { leida: false, page: 1, size: 5 }),
    );

    expect(resultado.total).toBe(1);
    const [url, opts] = get.mock.calls[0];
    expect(url).toBe('/api/test/tarjetas/tarjeta-0001/notificaciones');
    expect(opts?.params.toString()).toBe('leida=false&page=1&size=5');
  });

  it('given sin filtro when listar then no envía parámetros', async () => {
    const { servicio, get } = crear();

    await firstValueFrom(servicio.listar('tarjeta-0001'));

    expect(get.mock.calls[0][1]?.params.toString()).toBe('');
  });

  it('given id con caracteres especiales when listar then codifica la tarjeta', async () => {
    const { servicio, get } = crear();

    await firstValueFrom(servicio.listar('a/b'));

    expect(get.mock.calls[0][0]).toBe('/api/test/tarjetas/a%2Fb/notificaciones');
  });

  it('given id when marcarLeida then hace PATCH y devuelve la notificación leída', async () => {
    const { servicio, patch } = crear();

    const resultado = await firstValueFrom(servicio.marcarLeida(1));

    expect(patch.mock.calls[0][0]).toBe('/api/test/notificaciones/1/leida');
    expect(resultado.leida).toBe(true);
  });
});
