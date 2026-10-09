import { TestBed } from '@angular/core/testing';
import { StatusBadgeComponent } from './status-badge.component';

describe('StatusBadgeComponent', () => {
  it('given COMPLETED when rendered then shows Completado', () => {
    const fixture = TestBed.createComponent(StatusBadgeComponent);
    fixture.componentRef.setInput('status', 'COMPLETED');
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('Completado');
  });

  it('given REJECTED when rendered then shows Rechazado with the rejected class', () => {
    const fixture = TestBed.createComponent(StatusBadgeComponent);
    fixture.componentRef.setInput('status', 'REJECTED');
    fixture.detectChanges();

    const badge = fixture.nativeElement.querySelector('.badge') as HTMLElement;
    expect(badge.textContent).toContain('Rechazado');
    expect(badge.classList.contains('rejected')).toBe(true);
  });
});
