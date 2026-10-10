import { TestBed } from '@angular/core/testing';
import { ListaNotificacionesComponent } from './lista-notificaciones.component';
import { Notificacion } from '../data/models';

describe('ListaNotificacionesComponent', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({ imports: [ListaNotificacionesComponent] });
  });

  function render(estado: 'loading' | 'error' | 'success', items: Notificacion[]): HTMLElement {
    const fixture = TestBed.createComponent(ListaNotificacionesComponent);
    fixture.componentRef.setInput('estado', estado);
    fixture.componentRef.setInput('items', items);
    fixture.detectChanges();
    return fixture.nativeElement as HTMLElement;
  }

  it('given estado loading when render then muestra mensaje de carga', () => {
    expect(render('loading', []).textContent).toContain('Cargando');
  });

  it('given estado error when render then muestra alerta', () => {
    expect(render('error', []).querySelector('[role=alert]')).not.toBeNull();
  });

  it('given lista vacia when render then muestra estado vacio', () => {
    expect(render('success', []).textContent).toContain('No tienes notificaciones');
  });

  it('given items when render then crea un elemento por notificacion', () => {
    const items: Notificacion[] = [1, 2].map(i => ({
      id: `n${i}`, tarjetaRef: 'tok', ultimos4: '4242', tipo: 'PAGO', titulo: `T${i}`, mensaje: 'm',
      monto: null, moneda: null, leida: true, creadaEn: '2026-01-01T10:00:00Z'
    }));

    expect(render('success', items).querySelectorAll('li').length).toBe(2);
  });
});
