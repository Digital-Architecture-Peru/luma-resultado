import { TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { CuentasPageComponent } from './cuentas-page.component';
import { CuentasApiService } from '../services/cuentas-api.service';
import { Cuenta, PaginaCuentas } from '../models/cuenta.model';

const CUENTA: Cuenta = {
  id: '1',
  numeroEnmascarado: '****2345',
  tipo: 'AHORRO',
  moneda: 'PEN',
  saldo: 250,
  estado: 'ACTIVA',
  fechaApertura: '2021-03-15'
};

const PAGINA: PaginaCuentas = { contenido: [CUENTA], pagina: 0, tamanio: 20, totalElementos: 1, totalPaginas: 1 };

function crear(listar: () => ReturnType<CuentasApiService['listar']>) {
  TestBed.configureTestingModule({
    providers: [{ provide: CuentasApiService, useValue: { listar } }]
  });
  const fixture = TestBed.createComponent(CuentasPageComponent);
  fixture.detectChanges();
  return fixture;
}

describe('CuentasPageComponent', () => {
  it('given API ok, when carga, then muestra la cuenta con número enmascarado', () => {
    const fixture = crear(() => of(PAGINA));
    expect((fixture.nativeElement as HTMLElement).textContent).toContain('****2345');
  });

  it('given una cuenta, when se hace clic en la tarjeta, then muestra el detalle', () => {
    const fixture = crear(() => of(PAGINA));
    const el = fixture.nativeElement as HTMLElement;

    (el.querySelector('button.tarjeta') as HTMLButtonElement).click();
    fixture.detectChanges();

    expect(el.querySelector('app-detalle-cuenta')).not.toBeNull();
    expect(el.textContent).toContain('Fecha de apertura');
  });

  it('given API con fallo, when carga, then informa el error y ofrece reintentar', () => {
    const fixture = crear(() => throwError(() => new Error('fallo')));
    const texto = (fixture.nativeElement as HTMLElement).textContent ?? '';
    expect(texto).toContain('No se pudieron cargar las cuentas');
    expect(texto).toContain('Reintentar');
  });
});
