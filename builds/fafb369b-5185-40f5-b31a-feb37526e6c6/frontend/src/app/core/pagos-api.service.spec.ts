import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { PagosApiService } from './pagos-api.service';
import { PaginaPagos } from './pago.model';
import { environment } from '../../environments/environment';

describe('PagosApiService', () => {
  let servicio: PagosApiService;
  let http: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [provideHttpClient(), provideHttpClientTesting()] });
    servicio = TestBed.inject(PagosApiService);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    http.verify();
  });

  it('given filtros completos when consulta then envía parámetros con fechas UTC', () => {
    servicio.consultar({ desde: '2026-10-01', hasta: '2026-10-09', estado: 'PROCESADO', page: 2, size: 20 }).subscribe();

    const req = http.expectOne((r) => r.url === `${environment.apiBaseUrl}/pagos`);
    expect(req.request.method).toBe('GET');
    expect(req.request.params.get('desde')).toBe('2026-10-01T00:00:00Z');
    expect(req.request.params.get('hasta')).toBe('2026-10-09T23:59:59Z');
    expect(req.request.params.get('estado')).toBe('PROCESADO');
    expect(req.request.params.get('page')).toBe('2');
    expect(req.request.params.get('size')).toBe('20');
    req.flush({ items: [], page: 2, size: 20, total: 0 });
  });

  it('given filtros vacíos when consulta then solo envía paginación', () => {
    servicio.consultar({ desde: '', hasta: '', estado: '', page: 1, size: 20 }).subscribe();

    const req = http.expectOne((r) => r.url === `${environment.apiBaseUrl}/pagos`);
    expect(req.request.params.has('desde')).toBe(false);
    expect(req.request.params.has('hasta')).toBe(false);
    expect(req.request.params.has('estado')).toBe(false);
    req.flush({ items: [], page: 1, size: 20, total: 0 });
  });

  it('given respuesta del servidor when consulta then emite la página recibida', () => {
    const esperado: PaginaPagos = {
      items: [
        {
          id: 'a0000000-0000-4000-8000-000000000001',
          cuentaEnmascarada: '****5678',
          referencia: 'PAG-0001',
          beneficiario: 'Empresa Eléctrica Demo',
          monto: 85.4,
          moneda: 'USD',
          estado: 'PROCESADO',
          fechaPago: '2026-10-08T12:00:00Z',
          canal: 'WEB',
        },
      ],
      page: 1,
      size: 20,
      total: 1,
    };
    let recibido: PaginaPagos | undefined;

    servicio.consultar({ page: 1, size: 20 }).subscribe((p) => (recibido = p));
    http.expectOne((r) => r.url === `${environment.apiBaseUrl}/pagos`).flush(esperado);

    expect(recibido).toEqual(esperado);
  });
});
