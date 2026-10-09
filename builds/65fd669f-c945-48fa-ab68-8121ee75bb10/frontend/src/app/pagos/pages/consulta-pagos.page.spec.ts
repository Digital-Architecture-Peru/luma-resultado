import { HttpErrorResponse } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { Pagina, Pago } from '../data/pago.model';
import { PagosApiService } from '../data/pagos-api.service';
import { ConsultaPagosPage } from './consulta-pagos.page';

const PAGO: Pago = {
  id: 1,
  cuentaEnmascarada: '****1234',
  beneficiario: 'Empresa Demo',
  concepto: 'Recibo de luz',
  monto: 85.4,
  moneda: 'USD',
  estado: 'PROCESADO',
  fechaPago: '2026-09-05T14:10:00Z',
};

function pagina(contenido: Pago[]): Pagina<Pago> {
  return { contenido, page: 0, size: 10, total: contenido.length, totalPaginas: 1 };
}

describe('ConsultaPagosPage', () => {
  function crear(listar: jest.Mock) {
    TestBed.configureTestingModule({
      providers: [{ provide: PagosApiService, useValue: { listar } }],
    });
    const fixture = TestBed.createComponent(ConsultaPagosPage);
    fixture.detectChanges();
    return fixture;
  }

  it('given pagina nueva, when carga, then invita a consultar sin llamar a la API', () => {
    const listar = jest.fn();
    const fixture = crear(listar);
    expect(fixture.nativeElement.textContent).toContain('pulsa Consultar');
    expect(listar).not.toHaveBeenCalled();
  });

  it('given respuesta con pagos, when consultar, then renderiza filas y filtra por cuenta', () => {
    const listar = jest.fn().mockReturnValue(of(pagina([PAGO])));
    const fixture = crear(listar);

    fixture.componentInstance.aplicar({ desde: '2026-09-01', hasta: '', estado: 'PROCESADO' });
    fixture.detectChanges();

    const filas = fixture.nativeElement.querySelectorAll('tbody tr');
    expect(filas.length).toBe(1);
    expect(filas[0].textContent).toContain('Empresa Demo');
    const filtro = listar.mock.calls[0][0];
    expect(filtro.desde).toBe('2026-09-01T00:00:00Z');
    expect(filtro.hasta).toBeUndefined();
    expect(filtro.estado).toBe('PROCESADO');
    expect(filtro.page).toBe(0);
  });

  it('given respuesta vacia, when consultar, then muestra estado vacio', () => {
    const fixture = crear(jest.fn().mockReturnValue(of(pagina([]))));
    fixture.componentInstance.aplicar({ desde: '', hasta: '', estado: '' });
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent).toContain('No hay pagos');
  });

  it('given error 400, when consultar, then muestra el detalle del problema', () => {
    const err = new HttpErrorResponse({ status: 400, error: { detail: "'size' debe estar entre 1 y 100" } });
    const fixture = crear(jest.fn().mockReturnValue(throwError(() => err)));
    fixture.componentInstance.aplicar({ desde: '', hasta: '', estado: '' });
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('[role="alert"]').textContent).toContain("'size'");
  });

  it('given pago en tabla, when ver detalle, then abre y cierra el detalle', () => {
    const fixture = crear(jest.fn().mockReturnValue(of(pagina([PAGO]))));
    fixture.componentInstance.aplicar({ desde: '', hasta: '', estado: '' });
    fixture.detectChanges();

    fixture.nativeElement.querySelector('tbody button').click();
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent).toContain('Detalle del pago #1');

    fixture.componentInstance.seleccionado.set(null);
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent).not.toContain('Detalle del pago');
  });
});
