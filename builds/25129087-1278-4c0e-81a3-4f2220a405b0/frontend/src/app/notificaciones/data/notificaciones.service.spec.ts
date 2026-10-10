import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { CLIENTE_DEMO, NotificacionesService } from './notificaciones.service';
import { Preferencia } from './models';

describe('NotificacionesService', () => {
  let servicio: NotificacionesService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [provideHttpClient(), provideHttpClientTesting()] });
    servicio = TestBed.inject(NotificacionesService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('given filtro when listar then envia query, ruta y header de cliente', () => {
    servicio.listar('tok_1', { leida: false, page: 2, size: 5 }).subscribe();

    const req = httpMock.expectOne(r => r.url.endsWith('/api/v1/tarjetas/tok_1/notificaciones'));
    expect(req.request.method).toBe('GET');
    expect(req.request.params.get('leida')).toBe('false');
    expect(req.request.params.get('page')).toBe('2');
    expect(req.request.params.get('size')).toBe('5');
    expect(req.request.headers.get('X-Cliente-Id')).toBe(CLIENTE_DEMO);
    req.flush({ items: [], total: 0, page: 2, size: 5 });
  });

  it('given sin filtro when listar then no envia parametros', () => {
    servicio.listar('tok_1').subscribe();

    const req = httpMock.expectOne(r => r.url.endsWith('/notificaciones'));
    expect(req.request.params.keys()).toEqual([]);
    req.flush({ items: [], total: 0, page: 1, size: 20 });
  });

  it('given id when marcarLeida then hace PATCH a lectura', () => {
    servicio.marcarLeida('abc').subscribe();

    const req = httpMock.expectOne(r => r.url.endsWith('/api/v1/notificaciones/abc/lectura'));
    expect(req.request.method).toBe('PATCH');
    req.flush(null, { status: 204, statusText: 'No Content' });
  });

  it('given respuesta when obtenerPreferencias then devuelve la lista interna', () => {
    const prefs: Preferencia[] = [{ tipo: 'PAGO', canal: 'WEB', habilitada: true, umbralMonto: null }];
    let resultado: Preferencia[] = [];

    servicio.obtenerPreferencias('tok_1').subscribe(p => (resultado = p));
    httpMock.expectOne(r => r.url.endsWith('/tarjetas/tok_1/preferencias')).flush({ preferencias: prefs });

    expect(resultado).toEqual(prefs);
  });

  it('given preferencias when guardarPreferencias then hace PUT con el cuerpo envuelto', () => {
    const prefs: Preferencia[] = [{ tipo: 'COMPRA', canal: 'EMAIL', habilitada: false, umbralMonto: 10 }];

    servicio.guardarPreferencias('tok_1', prefs).subscribe();

    const req = httpMock.expectOne(r => r.url.endsWith('/tarjetas/tok_1/preferencias'));
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual({ preferencias: prefs });
    req.flush({ preferencias: prefs });
  });
});
