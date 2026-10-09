import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { PagosApiService } from './pagos-api.service';
import { Pagina, Pago } from '../models/pago.model';

describe('PagosApiService', () => {
  let service: PagosApiService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(PagosApiService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('given filtros completos when listar then envía params y header de cliente', () => {
    const respuesta: Pagina<Pago> = { contenido: [], page: 1, size: 10, totalElementos: 0, totalPaginas: 0 };
    let recibida: Pagina<Pago> | undefined;

    service
      .listar({ estado: 'PENDIENTE', desde: '2026-09-01', hasta: '2026-09-30' }, 1, 10)
      .subscribe((p) => (recibida = p));

    const req = httpMock.expectOne((r) => r.url === '/api/v1/pagos');
    expect(req.request.method).toBe('GET');
    expect(req.request.params.get('estado')).toBe('PENDIENTE');
    expect(req.request.params.get('desde')).toBe('2026-09-01');
    expect(req.request.params.get('hasta')).toBe('2026-09-30');
    expect(req.request.params.get('page')).toBe('1');
    expect(req.request.params.get('size')).toBe('10');
    expect(req.request.headers.get('X-Cliente-Id')).toBe('CLI-0001');
    req.flush(respuesta);

    expect(recibida).toEqual(respuesta);
  });

  it('given filtros vacíos when listar then no envía estado ni fechas', () => {
    service.listar({ estado: '', desde: '', hasta: '' }, 0, 20).subscribe();

    const req = httpMock.expectOne((r) => r.url === '/api/v1/pagos');
    expect(req.request.params.has('estado')).toBe(false);
    expect(req.request.params.has('desde')).toBe(false);
    expect(req.request.params.has('hasta')).toBe(false);
    req.flush({ contenido: [], page: 0, size: 20, totalElementos: 0, totalPaginas: 0 });
  });
});
