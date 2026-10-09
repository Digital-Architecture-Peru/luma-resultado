import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Cuenta } from '../../../features/cuentas/models/cuenta.model';
import { CuentasListaComponent } from './cuentas-lista.component';

const crear = (id: number): Cuenta => ({
  id,
  numeroEnmascarado: `****000${id}`,
  tipo: 'AHORROS',
  moneda: 'PEN',
  saldoDisponible: 10,
  estado: 'ACTIVA',
  fechaApertura: '2021-03-15',
});

describe('CuentasListaComponent', () => {
  let fixture: ComponentFixture<CuentasListaComponent>;

  beforeEach(() => {
    fixture = TestBed.createComponent(CuentasListaComponent);
  });

  it('given sin cuentas, when renderiza, then muestra el mensaje de vacío', () => {
    fixture.componentRef.setInput('cuentas', []);
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('No hay cuentas para mostrar.');
  });

  it('given dos cuentas, when renderiza, then muestra una tarjeta por cuenta', () => {
    fixture.componentRef.setInput('cuentas', [crear(1), crear(2)]);
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelectorAll('app-cuenta-card').length).toBe(2);
  });
});
