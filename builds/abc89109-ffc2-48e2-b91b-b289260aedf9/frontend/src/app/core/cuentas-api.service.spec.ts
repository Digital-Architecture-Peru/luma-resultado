import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { API_CUENTAS, CuentasApiService } from './cuentas-api.service';
import { CuentaResumen } from './cuenta.model';

describe('CuentasApiService', () => {
  let servicio: CuentasApiService;
  let http: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    servicio = TestBed.inject(CuentasApiService);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => http.verify());

  it('given un clienteId, when listar, then hace GET con el parametro y devuelve las cuentas', () => {
    const esperado: CuentaResumen[] = [
      { id: '1', numeroEnmascarado: '****2345', tipo: 'AHORRO', moneda: 'PEN', saldoDisponible: 10, estado: 'ACTIVA' },
    ];
    let recibido: CuentaResumen[] = [];

    servicio.listar('CLI-001').subscribe((cuentas) => (recibido = cuentas));

    const req = http.expectOne((r) => r.url === API_CUENTAS);
    expect(req.request.method).toBe('GET');
    expect(req.request.params.get('clienteId')).toBe('CLI-001');
    req.flush(esperado);
    expect(recibido).toEqual(esperado);
  });

  it('given un error 400, when listar, then propaga el error', () => {
    let status = 0;

    servicio.listar('***').subscribe({ error: (e) => (status = e.status) });

    http.expectOne((r) => r.url === API_CUENTAS).flush({}, { status: 400, statusText: 'Bad Request' });
    expect(status).toBe(400);
  });
});
