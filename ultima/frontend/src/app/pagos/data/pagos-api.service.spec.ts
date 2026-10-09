import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { PagosApiService } from './pagos-api.service';

describe('PagosApiService', () => {
  let service: PagosApiService;
  let http: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [provideHttpClient(), provideHttpClientTesting()] });
    service = TestBed.inject(PagosApiService);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => http.verify());

  it('given filtros completos, when listar, then envia todos los parametros', () => {
    service
      .listar({ cuentaId: 'C1', desde: '2026-10-01T00:00:00Z', estado: 'PENDIENTE', page: 1, size: 10 })
      .subscribe();

    const req = http.expectOne((r) => r.url === '/api/v1/pagos');
    expect(req.request.method).toBe('GET');
    expect(req.request.params.get('cuentaId')).toBe('C1');
    expect(req.request.params.get('desde')).toBe('2026-10-01T00:00:00Z');
    expect(req.request.params.get('estado')).toBe('PENDIENTE');
    expect(req.request.params.get('page')).toBe('1');
    expect(req.request.params.get('size')).toBe('10');
    req.flush({ contenido: [], page: 1, size: 10, total: 0, totalPaginas: 0 });
  });

  it('given filtros vacios, when listar, then omite los opcionales', () => {
    service.listar({ cuentaId: 'C1', estado: '', page: 0, size: 20 }).subscribe();

    const req = http.expectOne((r) => r.url === '/api/v1/pagos');
    expect(req.request.params.has('estado')).toBe(false);
    expect(req.request.params.has('desde')).toBe(false);
    expect(req.request.params.has('hasta')).toBe(false);
    req.flush({ contenido: [], page: 0, size: 20, total: 0, totalPaginas: 0 });
  });

  it('given id, when obtener, then consulta el detalle con la cuenta', () => {
    service.obtener(5, 'C1').subscribe();

    const req = http.expectOne((r) => r.url === '/api/v1/pagos/5');
    expect(req.request.params.get('cuentaId')).toBe('C1');
    req.flush({});
  });
});
