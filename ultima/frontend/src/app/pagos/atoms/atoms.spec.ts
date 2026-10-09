import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CuentaEnmascaradaComponent } from './cuenta-enmascarada.component';
import { EstadoBadgeComponent } from './estado-badge.component';
import { MontoComponent } from './monto.component';

describe('atomos', () => {
  it('given estado RECHAZADO, when render, then muestra etiqueta textual', () => {
    const fixture: ComponentFixture<EstadoBadgeComponent> = TestBed.createComponent(EstadoBadgeComponent);
    fixture.componentRef.setInput('estado', 'RECHAZADO');
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent).toContain('Rechazado');
  });

  it('given monto y moneda, when render, then formatea con dos decimales', () => {
    const fixture = TestBed.createComponent(MontoComponent);
    fixture.componentRef.setInput('valor', 85.4);
    fixture.componentRef.setInput('moneda', 'USD');
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent).toContain('85.40');
  });

  it('given cuenta enmascarada, when render, then expone etiqueta accesible', () => {
    const fixture = TestBed.createComponent(CuentaEnmascaradaComponent);
    fixture.componentRef.setInput('valor', '****1234');
    fixture.detectChanges();
    const span: HTMLElement = fixture.nativeElement.querySelector('span');
    expect(span.getAttribute('aria-label')).toBe('Cuenta terminada en 1234');
    expect(span.textContent).toBe('****1234');
  });
});
