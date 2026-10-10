import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ItemNotificacionComponent } from './item-notificacion.component';
import { Notificacion } from '../data/models';

const base: Notificacion = {
  id: 'n1', tarjetaRef: 'tok', ultimos4: '4242', tipo: 'COMPRA', titulo: 'Compra aprobada',
  mensaje: 'Compra en COMERCIO DEMO', monto: 125.5, moneda: 'USD', leida: false,
  creadaEn: '2026-01-01T10:00:00Z'
};

describe('ItemNotificacionComponent', () => {
  let fixture: ComponentFixture<ItemNotificacionComponent>;

  function crear(n: Notificacion): HTMLElement {
    fixture = TestBed.createComponent(ItemNotificacionComponent);
    fixture.componentRef.setInput('notificacion', n);
    fixture.detectChanges();
    return fixture.nativeElement as HTMLElement;
  }

  beforeEach(() => {
    TestBed.configureTestingModule({ imports: [ItemNotificacionComponent] });
  });

  it('given notificacion no leida when render then muestra ultimos 4, badge y boton', () => {
    const el = crear(base);

    expect(el.textContent).toContain('•••• 4242');
    expect(el.textContent).toContain('Nueva');
    expect(el.querySelector('button')?.textContent).toContain('Marcar como leída');
  });

  it('given boton when click then emite el id', () => {
    const el = crear(base);
    const emitidos: string[] = [];
    fixture.componentInstance.marcar.subscribe((id: string) => emitidos.push(id));

    el.querySelector('button')?.click();

    expect(emitidos).toEqual(['n1']);
  });

  it('given notificacion leida when render then no muestra boton', () => {
    const el = crear({ ...base, leida: true });

    expect(el.querySelector('button')).toBeNull();
    expect(el.textContent).toContain('Leída');
  });
});
