import { TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { CuentasPageComponent } from './cuentas-page.component';
import { CuentasApiService } from '../../../core/cuentas-api.service';
import { CuentaResumen } from '../../../core/cuenta.model';

describe('CuentasPageComponent', () => {
  const cuenta: CuentaResumen = {
    id: '1', numeroEnmascarado: '****2345', tipo: 'AHORRO', moneda: 'PEN', saldoDisponible: 100, estado: 'ACTIVA',
  };

  function crear(listar: jasmine.Spy) {
    TestBed.configureTestingModule({ providers: [{ provide: CuentasApiService, useValue: { listar } }] });
    const fixture = TestBed.createComponent(CuentasPageComponent);
    fixture.detectChanges();
    return fixture;
  }

  it('given respuesta exitosa, when consultar, then muestra la lista', () => {
    const listar = jasmine.createSpy('listar').and.returnValue(of([cuenta]));
    const fixture = crear(listar);

    fixture.componentInstance.consultar();
    fixture.detectChanges();

    expect(listar).toHaveBeenCalledWith('CLI-001');
    expect(fixture.nativeElement.querySelectorAll('app-cuenta-item').length).toBe(1);
  });

  it('given error 400, when consultar, then muestra alerta de cliente no valido', () => {
    const listar = jasmine.createSpy('listar').and.returnValue(throwError(() => ({ status: 400 })));
    const fixture = crear(listar);

    fixture.componentInstance.consultar();
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('[role=alert]').textContent).toContain('no es valido');
  });
});
