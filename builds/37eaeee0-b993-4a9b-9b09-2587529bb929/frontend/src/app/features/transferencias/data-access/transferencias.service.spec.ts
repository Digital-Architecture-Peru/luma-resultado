import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideZonelessChangeDetection } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { TransferenciaSolicitud } from './models';
import { TransferenciasService } from './transferencias.service';

describe('TransferenciasService', () => {
  let servicio: TransferenciasService;
  let http: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideZonelessChangeDetection(),
        provideHttpClient(),
        provideHttpClientTesting(),
      ],
    });
    servicio = TestBed.inject(TransferenciasService);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    http.verify();
  });

  it('given el servicio, when listarCuentas, then hace GET a /api/v1/cuentas', () => {
    servicio.listarCuentas().subscribe();
    const req = http.expectOne('/api/v1/cuentas');
    expect(req.request.method).toBe('GET');
    req.flush([]);
  });

  it('given una solicitud, when transferir, then hace POST con Idempotency-Key y cuerpo', () => {
    const solicitud: TransferenciaSolicitud = {
      origenId: 'a',
      destinoId: 'b',
      monto: 10,
      moneda: 'USD',
      concepto: 'x',
    };
    servicio.transferir(solicitud, 'clave-1').subscribe();
    const req = http.expectOne('/api/v1/transferencias');
    expect(req.request.method).toBe('POST');
    expect(req.request.headers.get('Idempotency-Key')).toBe('clave-1');
    expect(req.request.body).toEqual(solicitud);
    req.flush({});
  });
});
