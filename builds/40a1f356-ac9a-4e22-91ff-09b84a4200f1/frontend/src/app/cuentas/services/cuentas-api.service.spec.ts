import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { CuentasApiService } from './cuentas-api.service';
import { environment } from '../../../environments/environment';

describe('CuentasApiService', () => {
  let service: CuentasApiService;
  let http: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [provideHttpClient(), provideHttpClientTesting()] });
    service = TestBed.inject(CuentasApiService);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => http.verify());

  it('given paginación, when listar, then envía GET con parámetros y cabecera de cliente', () => {
    service.listar(1, 5).subscribe();

    const req = http.expectOne((r) => r.url === `${environment.apiBaseUrl}/cuentas`);
    expect(req.request.method).toBe('GET');
    expect(req.request.params.get('pagina')).toBe('1');
    expect(req.request.params.get('tamanio')).toBe('5');
    expect(req.request.headers.get('X-Cliente-Id')).toBe(environment.clienteId);
    req.flush({ contenido: [], pagina: 1, tamanio: 5, totalElementos: 0, totalPaginas: 0 });
  });

  it('given un id, when obtener, then consulta el detalle de esa cuenta', () => {
    service.obtener('abc').subscribe();

    const req = http.expectOne(`${environment.apiBaseUrl}/cuentas/abc`);
    expect(req.request.method).toBe('GET');
    req.flush({});
  });
});
