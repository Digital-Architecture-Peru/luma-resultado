import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { Transaccion } from '../models/transaccion.model';
import { TransaccionApiService } from './transaccion-api.service';

const TX: Transaccion = {
  id: 'abc',
  tarjetaId: 1,
  monto: 10,
  moneda: 'USD',
  estado: 'APROBADA',
  creadoEn: '2026-01-01T00:00:00Z',
};

describe('TransaccionApiService', () => {
  let servicio: TransaccionApiService;
  let http: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    servicio = TestBed.inject(TransaccionApiService);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    http.verify();
  });

  it('given solicitud when registrar then envía Idempotency-Key y cliente', () => {
    let resultado: { repetida: boolean } | undefined;
    servicio.registrar(1, { monto: 10, moneda: 'USD' }, 'k-1').subscribe((r) => (resultado = r));

    const req = http.expectOne('/api/tarjetas/1/transacciones');
    expect(req.request.method).toBe('POST');
    expect(req.request.headers.get('Idempotency-Key')).toBe('k-1');
    expect(req.request.headers.get('X-Cliente-Id')).toBe('cli-001');
    req.flush(TX, { status: 201, statusText: 'Created' });

    expect(resultado?.repetida).toBe(false);
  });

  it('given respuesta 200 when registrar then marca repetida', () => {
    let resultado: { repetida: boolean } | undefined;
    servicio.registrar(1, { monto: 10, moneda: 'USD' }, 'k-1').subscribe((r) => (resultado = r));

    http.expectOne('/api/tarjetas/1/transacciones').flush(TX, { status: 200, statusText: 'OK' });

    expect(resultado?.repetida).toBe(true);
  });

  it('given tarjeta when historial then pide con límite', () => {
    servicio.historial(2, 5).subscribe();

    const req = http.expectOne((r) => r.url === '/api/tarjetas/2/transacciones');
    expect(req.request.params.get('limite')).toBe('5');
    req.flush([TX]);
  });

  it('given cliente when listarTarjetas then usa GET /tarjetas', () => {
    servicio.listarTarjetas().subscribe();

    const req = http.expectOne('/api/tarjetas');
    expect(req.request.method).toBe('GET');
    req.flush([]);
  });
});
