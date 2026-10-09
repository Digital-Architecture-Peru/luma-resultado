import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TablaPagosComponent } from './tabla-pagos.component';
import { Pago } from '../../core/pago.model';

function crearPago(n: number, estado: Pago['estado'] = 'PROCESADO'): Pago {
  return {
    id: `id-${n}`,
    cuentaEnmascarada: '****5678',
    referencia: `PAG-000${n}`,
    beneficiario: 'Beneficiario Ficticio',
    monto: 10.5 * n,
    moneda: 'USD',
    estado,
    fechaPago: '2026-10-08T12:00:00Z',
    canal: 'WEB',
  };
}

describe('TablaPagosComponent', () => {
  let fixture: ComponentFixture<TablaPagosComponent>;
  let componente: TablaPagosComponent;

  beforeEach(() => {
    TestBed.configureTestingModule({ imports: [TablaPagosComponent] });
    fixture = TestBed.createComponent(TablaPagosComponent);
    componente = fixture.componentInstance;
  });

  it('given sin pagos when renderiza then muestra mensaje vacío y no tabla', () => {
    fixture.detectChanges();
    const el: HTMLElement = fixture.nativeElement;

    expect(el.querySelector('[role="status"]')?.textContent).toContain('No hay pagos');
    expect(el.querySelector('table')).toBeNull();
  });

  it('given pagos when renderiza then muestra una fila por pago con cuenta enmascarada y estado', () => {
    fixture.componentRef.setInput('pagos', [crearPago(1), crearPago(2, 'RECHAZADO')]);
    fixture.componentRef.setInput('total', 2);
    fixture.detectChanges();
    const el: HTMLElement = fixture.nativeElement;

    expect(el.querySelectorAll('tbody tr').length).toBe(2);
    expect(el.textContent).toContain('****5678');
    expect(el.textContent).toContain('RECHAZADO');
    expect(el.textContent).toContain('10.50 USD');
  });

  it('given página 1 de 3 when pulsa Siguiente then emite la página 2', () => {
    fixture.componentRef.setInput('pagos', [crearPago(1)]);
    fixture.componentRef.setInput('page', 1);
    fixture.componentRef.setInput('size', 20);
    fixture.componentRef.setInput('total', 50);
    fixture.detectChanges();
    const emitidas: number[] = [];
    componente.paginaCambio.subscribe((p: number) => emitidas.push(p));

    const botones = (fixture.nativeElement as HTMLElement).querySelectorAll('nav button');
    (botones[1] as HTMLButtonElement).click();

    expect(emitidas).toEqual([2]);
  });

  it('given primera página when renderiza then el botón Anterior está deshabilitado', () => {
    fixture.componentRef.setInput('pagos', [crearPago(1)]);
    fixture.componentRef.setInput('total', 1);
    fixture.detectChanges();

    const anterior = (fixture.nativeElement as HTMLElement).querySelector('nav button') as HTMLButtonElement;

    expect(anterior.disabled).toBe(true);
  });
});
