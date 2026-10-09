import { TestBed } from '@angular/core/testing';
import { ListaCuentasComponent } from './lista-cuentas.organism';
import { Cuenta } from '../data/account.model';

const cuenta: Cuenta = {
  id: 'aaaaaaaa-0000-4000-8000-000000000001',
  maskedNumber: '****1234',
  productType: 'AHORROS',
  currency: 'PEN',
  availableBalance: 100,
  ledgerBalance: 100,
  status: 'ACTIVA',
  openedAt: '2024-01-01T00:00:00Z',
  updatedAt: '2026-01-01T00:00:00Z'
};

describe('ListaCuentasComponent', () => {
  function crear(cuentas: Cuenta[]) {
    const fixture = TestBed.createComponent(ListaCuentasComponent);
    fixture.componentRef.setInput('cuentas', cuentas);
    fixture.detectChanges();
    return fixture;
  }

  it('given accounts when rendering then shows masked number and product', () => {
    const el: HTMLElement = crear([cuenta]).nativeElement;
    expect(el.textContent).toContain('****1234');
    expect(el.textContent).toContain('AHORROS');
  });

  it('given no accounts when rendering then shows empty message', () => {
    const el: HTMLElement = crear([]).nativeElement;
    expect(el.textContent).toContain('No tienes cuentas para mostrar');
  });

  it('given a card when clicking detail then emits the account id', () => {
    const fixture = crear([cuenta]);
    const emitidos: string[] = [];
    fixture.componentInstance.seleccionar.subscribe((id) => emitidos.push(id));

    (fixture.nativeElement as HTMLElement).querySelector('button')!.click();

    expect(emitidos).toEqual([cuenta.id]);
  });
});
