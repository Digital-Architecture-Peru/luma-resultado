import { TestBed } from '@angular/core/testing';
import { StatusBadgeComponent } from './status-badge.component';

describe('StatusBadgeComponent', () => {
  it('given estado PENDIENTE when renderiza then muestra texto y clase del estado', () => {
    const fixture = TestBed.createComponent(StatusBadgeComponent);
    fixture.componentRef.setInput('estado', 'PENDIENTE');
    fixture.detectChanges();
    const el = (fixture.nativeElement as HTMLElement).querySelector('.badge') as HTMLElement;
    expect(el.textContent?.trim()).toBe('Pendiente');
    expect(el.classList.contains('badge--pendiente')).toBe(true);
  });

  it('given estado RECHAZADO when renderiza then muestra Rechazado', () => {
    const fixture = TestBed.createComponent(StatusBadgeComponent);
    fixture.componentRef.setInput('estado', 'RECHAZADO');
    fixture.detectChanges();
    expect((fixture.nativeElement as HTMLElement).textContent).toContain('Rechazado');
  });
});
