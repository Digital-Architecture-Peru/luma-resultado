import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { Pago, PagoRequest } from '../pago.model';
import { PagosApiService } from './pagos-api.service';

describe('PagosApiService', () => {
  let servicio: PagosApiService;
  let http: HttpTestingController;

  const solicitud: PagoRequest = {
    cuentaOrigen: '0000-FAKE-0001',
    cuentaDestino: '0000-FAKE-0002',
    monto: 10,
    moneda: 'USD',
  };

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [provideHttpClient(), provideHttpClientTesting()] });
    servicio = TestBed.inject(PagosApiService);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    http.verify();
  });

  it('given una solicitud, when crear, then envía POST con Idempotency-Key', () => {
    let recibido: Pago | undefined;
    servicio.crear(solicitud, 'clave-1').subscribe((p) => (recibido = p));

    const req = http.expectOne('/api/v1/pagos');
    expect(req.request.method).toBe('POST');
    expect(req.request.headers.get('Idempotency-Key')).toBe('clave-1');
    expect(req.request.body).toEqual(solicitud);

    const respuesta: Pago = { ...solicitud, id: 'abc', estado: 'CONFIRMADO', creadoEn: '2026-01-01T00:00:00Z' };
    req.flush(respuesta);
    expect(recibido?.estado).toBe('CONFIRMADO');
  });

  it('given un id, when obtener, then consulta GET /pagos/{id}', () => {
    servicio.obtener('abc').subscribe();
    const req = http.expectOne('/api/v1/pagos/abc');
    expect(req.request.method).toBe('GET');
    req.flush({});
  });

  it('given una cuenta, when listar, then envía cuentaOrigen como parámetro', () => {
    servicio.listar('0000-FAKE-0001').subscribe();
    const req = http.expectOne((r) => r.url === '/api/v1/pagos');
    expect(req.request.params.get('cuentaOrigen')).toBe('0000-FAKE-0001');
    req.flush([]);
  });
});
