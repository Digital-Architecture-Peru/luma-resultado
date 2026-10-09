import { TestBed } from '@angular/core/testing';
import { StatusBadgeComponent } from './status-badge.component';
import { CardStatus } from '../data/card.model';

describe('StatusBadgeComponent', () => {
  function render(status: CardStatus): HTMLElement {
    const fixture = TestBed.createComponent(StatusBadgeComponent);
    fixture.componentRef.setInput('status', status);
    fixture.detectChanges();
    return fixture.nativeElement.querySelector('.badge');
  }

  it('shows "Activa" with the ok style for ACTIVE', () => {
    const el = render('ACTIVE');
    expect(el.textContent?.trim()).toBe('Activa');
    expect(el.classList).toContain('ok');
  });

  it('shows "Bloqueada" with the bad style for BLOCKED', () => {
    const el = render('BLOCKED');
    expect(el.textContent?.trim()).toBe('Bloqueada');
    expect(el.classList).toContain('bad');
  });

  it('shows "Vencida" without highlight for EXPIRED', () => {
    const el = render('EXPIRED');
    expect(el.textContent?.trim()).toBe('Vencida');
    expect(el.classList).not.toContain('ok');
  });
});
