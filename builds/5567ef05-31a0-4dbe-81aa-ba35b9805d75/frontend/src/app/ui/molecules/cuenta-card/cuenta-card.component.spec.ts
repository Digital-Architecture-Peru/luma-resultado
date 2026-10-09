import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Cuenta } from '../../../features/cuentas/models/cuenta.model';
import { CuentaCardComponent } from './cuenta-card.component';

const CUENTA: Cuenta = {
  id: 4,
  numeroEnmascarado: '****0044',
  tipo: 'CORRIENTE',
  moneda: 'PEN',
  saldoDisponible: 100,
  estado: 'BLOQUEADA',
  fechaApertura: '2020-01-10',
};

describe('CuentaCardComponent', () => {
  let fixture: ComponentFixture<CuentaCardComponent>;

  beforeEach(() => {
    fixture = TestBed.createComponent(CuentaCardComponent);
    fixture.componentRef.setInput('cuenta', CUENTA);
    fixture.detectChanges();
  });

  it('given una cuenta, when renderiza, then muestra tipo, número enmascarado y estado', () => {
    const texto: string = fixture.nativeElement.textContent;
    expect(texto).toContain('CORRIENTE');
    expect(texto).toContain('****0044');
    expect(texto).toContain('BLOQUEADA');
  });

  it('given una cuenta bloqueada, when renderiza, then el badge usa el tono de advertencia', () => {
    expect(fixture.nativeElement.querySelector('.badge--warn')).not.toBeNull();
  });
});
