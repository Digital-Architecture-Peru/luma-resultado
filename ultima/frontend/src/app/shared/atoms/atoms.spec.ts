import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MontoComponent } from './monto.component';
import { BadgeEstadoComponent } from './badge-estado.component';
import { NumeroEnmascaradoComponent } from './numero-enmascarado.component';

describe('Atoms', () => {
  it('given monto y moneda, when renderiza, then formatea con dos decimales', () => {
    const fixture: ComponentFixture<MontoComponent> = TestBed.createComponent(MontoComponent);
    fixture.componentRef.setInput('valor', 1250.5);
    fixture.componentRef.setInput('moneda', 'USD');
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('1,250.50');
  });

  it('given estado BLOQUEADA, when renderiza, then muestra texto y clase del estado', () => {
    const fixture = TestBed.createComponent(BadgeEstadoComponent);
    fixture.componentRef.setInput('estado', 'BLOQUEADA');
    fixture.detectChanges();

    const el: HTMLElement = fixture.nativeElement.querySelector('.badge');
    expect(el.textContent).toContain('BLOQUEADA');
    expect(el.classList.contains('bloqueada')).toBeTrue();
  });

  it('given numero enmascarado, when renderiza, then muestra el texto y no el numero completo', () => {
    const fixture = TestBed.createComponent(NumeroEnmascaradoComponent);
    fixture.componentRef.setInput('numero', '****2345');
    fixture.detectChanges();

    const el: HTMLElement = fixture.nativeElement.querySelector('.numero');
    expect(el.textContent).toBe('****2345');
    expect(fixture.componentInstance.ultimos).toBe('2345');
  });

  it('given numero enmascarado, when renderiza, then expone aria-label con los ultimos digitos', () => {
    const fixture = TestBed.createComponent(NumeroEnmascaradoComponent);
    fixture.componentRef.setInput('numero', '****2345');
    fixture.detectChanges();

    const el: HTMLElement = fixture.nativeElement.querySelector('.numero');
    expect(el.getAttribute('aria-label')).toBe('Numero de cuenta terminado en 2345');
  });
});
