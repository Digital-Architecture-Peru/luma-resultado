import { TestBed } from '@angular/core/testing';
import { StatusBadgeComponent } from './status-badge.component';

describe('StatusBadgeComponent', () => {
  function render(status: 'UNREAD' | 'READ'): HTMLElement {
    const fixture = TestBed.createComponent(StatusBadgeComponent);
    fixture.componentRef.setInput('status', status);
    fixture.detectChanges();
    return fixture.nativeElement as HTMLElement;
  }

  it('shows "Nueva" for unread notifications', () => {
    expect(render('UNREAD').textContent).toContain('Nueva');
  });

  it('shows "Leída" for read notifications', () => {
    expect(render('READ').textContent).toContain('Leída');
  });
});
