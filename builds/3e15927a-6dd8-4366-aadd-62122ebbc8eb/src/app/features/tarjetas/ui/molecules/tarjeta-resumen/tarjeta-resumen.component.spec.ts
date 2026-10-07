import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Tarjeta } from '../../../domain/tarjeta.model';
import { TarjetaResumenComponent } from './tarjeta-resumen.component';

const TARJETA: Tarjeta = {
  id: 'x-1',
  alias: 'Visa Prueba',
  numero: '4000 0000 0000 4321',
  tipo: 'CREDITO',
  estado: 'ACTIVA',
  saldo: 100,
  limite: 500,
  moneda: 'PEN',
};

describe('TarjetaResumenComponent', () => {
  let fixture: ComponentFixture<TarjetaResumenComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({ imports: [TarjetaResumenComponent] });
    fixture = TestBed.createComponent(TarjetaResumenComponent);
    fixture.componentRef.setInput('tarjeta', TARJETA);
    fixture.detectChanges();
  });

  it('given una tarjeta when se renderiza then muestra alias, PAN enmascarado y estado', () => {
    const texto = (fixture.nativeElement as HTMLElement).textContent ?? '';

    expect(texto).toContain('Visa Prueba');
    expect(texto).toContain('**** 4321');
    expect(texto).not.toContain('4000 0000');
    expect(texto).toContain('Activa');
  });

  it('given una tarjeta de crédito when se renderiza then muestra el límite', () => {
    expect((fixture.nativeElement as HTMLElement).textContent).toContain('Límite');
  });

  it('given un clic when se pulsa la tarjeta then emite la tarjeta seleccionada', () => {
    let emitida: Tarjeta | undefined;
    fixture.componentInstance.seleccionar.subscribe((t) => (emitida = t));

    (fixture.nativeElement as HTMLElement).querySelector('button')!.click();

    expect(emitida).toEqual(TARJETA);
  });
});
