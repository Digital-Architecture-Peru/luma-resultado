import { TestBed } from '@angular/core/testing';
import { Pago } from '../../../features/pagos/models/pago.model';
import { TablaPagosComponent } from './tabla-pagos.component';

const pagos: Pago[] = [
  { id: '1', cuentaOrigenMask: '****-0123', beneficiario: 'Luz Demo', monto: 85.4, moneda: 'USD',
    estado: 'PROCESADO', fechaPago: '2026-09-01T10:15:00Z' },
  { id: '2', cuentaOrigenMask: '****-0456', beneficiario: 'Agua Demo', monto: 32.1, moneda: 'USD',
    estado: 'RECHAZADO', fechaPago: '2026-09-03T09:00:00Z' },
];

describe('TablaPagosComponent', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({ imports: [TablaPagosComponent] });
  });

  it('given pagos when render then muestra una fila por pago con su estado en texto', () => {
    const fixture = TestBed.createComponent(TablaPagosComponent);
    fixture.componentRef.setInput('pagos', pagos);
    fixture.detectChanges();

    const el = fixture.nativeElement as HTMLElement;
    const filas = el.querySelectorAll('tbody tr');
    expect(filas.length).toBe(2);
    expect(filas[0].textContent).toContain('Luz Demo');
    expect(filas[0].textContent).toContain('Procesado');
    expect(filas[1].textContent).toContain('Rechazado');
  });

  it('given lista vacía when render then muestra mensaje con role status', () => {
    const fixture = TestBed.createComponent(TablaPagosComponent);
    fixture.componentRef.setInput('pagos', []);
    fixture.detectChanges();

    const el = fixture.nativeElement as HTMLElement;
    expect(el.querySelector('table')).toBeNull();
    expect(el.querySelector('[role="status"]')?.textContent).toContain('No se encontraron pagos');
  });
});
