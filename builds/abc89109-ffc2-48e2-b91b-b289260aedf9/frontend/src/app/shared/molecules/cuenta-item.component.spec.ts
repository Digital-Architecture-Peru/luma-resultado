import { TestBed } from '@angular/core/testing';
import { CuentaItemComponent } from './cuenta-item.component';
import { CuentaResumen } from '../../core/cuenta.model';

describe('CuentaItemComponent', () => {
  const cuenta: CuentaResumen = {
    id: 'a', numeroEnmascarado: '****2345', tipo: 'CORRIENTE', moneda: 'PEN', saldoDisponible: 4820, estado: 'ACTIVA',
  };

  it('given una cuenta corriente, when renderiza, then compone atomos con tipo, numero, saldo y estado', () => {
    const fixture = TestBed.createComponent(CuentaItemComponent);
    fixture.componentRef.setInput('cuenta', cuenta);
    fixture.detectChanges();

    const texto: string = fixture.nativeElement.textContent;
    expect(texto).toContain('Cuenta corriente');
    expect(texto).toContain('****2345');
    expect(texto).toContain('4,820.00');
    expect(texto).toContain('ACTIVA');
  });
});
