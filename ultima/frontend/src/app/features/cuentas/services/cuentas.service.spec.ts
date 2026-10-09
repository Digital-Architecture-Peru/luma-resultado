import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { Cuenta } from '../models/cuenta.model';
import { API_CUENTAS, CLIENTE_DEMO_ID, CuentasService } from './cuentas.service';

describe('CuentasService', () => {
  let servicio: CuentasService;
  let http: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [provideHttpClient(), provideHttpClientTesting()] });
    servicio = TestBed.inject(CuentasService);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => http.verify());

  it('given la API, when listar, then hace GET con la cabecera X-Cliente-Id y devuelve las cuentas', () => {
    const esperadas: Cuenta[] = [
      { id: 1, numeroEnmascarado: '****0011', tipo: 'AHORROS', moneda: 'PEN', saldoDisponible: 10, estado: 'ACTIVA', fechaApertura: '2021-03-15' },
    ];
    let recibidas: Cuenta[] = [];

    servicio.listar().subscribe((cuentas) => (recibidas = cuentas));

    const peticion = http.expectOne(API_CUENTAS);
    expect(peticion.request.method).toBe('GET');
    expect(peticion.request.headers.get('X-Cliente-Id')).toBe(CLIENTE_DEMO_ID);
    peticion.flush(esperadas);
    expect(recibidas).toEqual(esperadas);
  });

  it('given un error del servidor, when listar, then propaga el error', () => {
    let fallo = false;

    servicio.listar().subscribe({ error: () => (fallo = true) });

    http.expectOne(API_CUENTAS).flush('error', { status: 500, statusText: 'Server Error' });
    expect(fallo).toBe(true);
  });
});
