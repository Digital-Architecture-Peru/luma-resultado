import { TestBed } from '@angular/core/testing';
import { PanelPreferenciasComponent } from './panel-preferencias.component';
import { Preferencia } from '../data/models';

describe('PanelPreferenciasComponent', () => {
  const prefs: Preferencia[] = [
    { tipo: 'COMPRA', canal: 'WEB', habilitada: true, umbralMonto: null },
    { tipo: 'PAGO', canal: 'WEB', habilitada: false, umbralMonto: null }
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({ imports: [PanelPreferenciasComponent] });
  });

  it('given preferencias when cambia un toggle y guarda then emite la lista actualizada sin mutar la entrada', () => {
    const fixture = TestBed.createComponent(PanelPreferenciasComponent);
    fixture.componentRef.setInput('preferencias', prefs);
    fixture.detectChanges();
    const emitidos: Preferencia[][] = [];
    fixture.componentInstance.guardar.subscribe((v: Preferencia[]) => emitidos.push(v));
    const el = fixture.nativeElement as HTMLElement;

    const casillas = el.querySelectorAll<HTMLInputElement>('input[type=checkbox]');
    casillas[1].checked = true;
    casillas[1].dispatchEvent(new Event('change'));
    fixture.detectChanges();
    el.querySelector('button')?.click();

    expect(casillas.length).toBe(2);
    expect(emitidos[0][1].habilitada).toBe(true);
    expect(prefs[1].habilitada).toBe(false);
  });

  it('given guardando when render then deshabilita el boton', () => {
    const fixture = TestBed.createComponent(PanelPreferenciasComponent);
    fixture.componentRef.setInput('preferencias', prefs);
    fixture.componentRef.setInput('guardando', true);
    fixture.detectChanges();

    expect((fixture.nativeElement as HTMLElement).querySelector('button')?.disabled).toBe(true);
  });
});
