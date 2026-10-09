import { TestBed } from '@angular/core/testing';
import { ListaCuentasComponent } from './lista-cuentas.component';
import { CuentaResumen } from '../../core/cuenta.model';

describe('ListaCuentasComponent', () => {
  const cuentas: CuentaResumen[] = [
    { id: '1', numeroEnmascarado: '****1111', tipo: 'AHORRO', moneda: 'PEN', saldoDisponible: 1, estado: 'ACTIVA' },
    { id: '2', numeroEnmascarado: '****2222', tipo: 'CORRIENTE', moneda: 'USD', saldoDisponible: 2, estado: 'CERRADA' },
  ];

  it('given dos cuentas, when renderiza, then muestra un item por cuenta', () => {
    const fixture = TestBed.createComponent(ListaCuentasComponent);
    fixture.componentRef.setInput('cuentas', cuentas);
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelectorAll('app-cuenta-item').length).toBe(2);
  });

  it('given lista vacia, when renderiza, then muestra el estado vacio', () => {
    const fixture = TestBed.createComponent(ListaCuentasComponent);
    fixture.componentRef.setInput('cuentas', []);
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('No se encontraron cuentas');
  });
});
