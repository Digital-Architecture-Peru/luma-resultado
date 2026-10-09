import { TestBed } from '@angular/core/testing';
import { MontoComponent } from './monto.component';
import { BadgeEstadoComponent } from './badge-estado.component';

describe('MontoComponent', () => {
  it('given valor y moneda, when se renderiza, then muestra el código de moneda y el importe', () => {
    const fixture = TestBed.createComponent(MontoComponent);
    fixture.componentRef.setInput('valor', 250);
    fixture.componentRef.setInput('moneda', 'PEN');
    fixture.detectChanges();

    const texto = (fixture.nativeElement as HTMLElement).textContent ?? '';
    expect(texto).toContain('PEN');
    expect(texto).toContain('250,00');
  });
});

describe('BadgeEstadoComponent', () => {
  it('given estado BLOQUEADA, when se renderiza, then muestra la etiqueta en texto', () => {
    const fixture = TestBed.createComponent(BadgeEstadoComponent);
    fixture.componentRef.setInput('estado', 'BLOQUEADA');
    fixture.detectChanges();

    expect((fixture.nativeElement as HTMLElement).textContent).toContain('Bloqueada');
  });
});
