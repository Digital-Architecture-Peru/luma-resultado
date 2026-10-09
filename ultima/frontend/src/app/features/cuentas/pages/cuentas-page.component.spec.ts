import { TestBed } from '@angular/core/testing';
import { Observable, of, throwError } from 'rxjs';
import { Cuenta } from '../models/cuenta.model';
import { CuentasService } from '../services/cuentas.service';
import { CuentasPageComponent } from './cuentas-page.component';

const CUENTA: Cuenta = {
  id: 1,
  numeroEnmascarado: '****0011',
  tipo: 'AHORROS',
  moneda: 'PEN',
  saldoDisponible: 2540.75,
  estado: 'ACTIVA',
  fechaApertura: '2021-03-15',
};

function crearPagina(respuesta: Observable<Cuenta[]>) {
  TestBed.configureTestingModule({
    providers: [{ provide: CuentasService, useValue: { listar: () => respuesta } }],
  });
  const fixture = TestBed.createComponent(CuentasPageComponent);
  fixture.detectChanges();
  return fixture;
}

describe('CuentasPageComponent', () => {
  it('given la API responde, when carga, then muestra las cuentas', () => {
    const fixture = crearPagina(of([CUENTA]));

    expect(fixture.nativeElement.textContent).toContain('****0011');
  });

  it('given la API falla, when carga, then muestra un mensaje de error accesible', () => {
    const fixture = crearPagina(throwError(() => new Error('fallo')));

    const alerta: HTMLElement | null = fixture.nativeElement.querySelector('[role="alert"]');
    expect(alerta?.textContent).toContain('No se pudieron cargar las cuentas');
  });

  it('given la API aún no responde, when carga, then muestra el estado de carga', () => {
    const fixture = crearPagina(new Observable<Cuenta[]>());

    expect(fixture.nativeElement.querySelector('[role="status"]')).not.toBeNull();
  });
});
