import { TestBed } from '@angular/core/testing';
import { BadgeStatusComponent } from './badge-status.component';

describe('BadgeStatusComponent', () => {
  it('given a blocked status when rendering then shows the Spanish label', () => {
    const fixture = TestBed.createComponent(BadgeStatusComponent);
    fixture.componentRef.setInput('status', 'Blocked');
    fixture.detectChanges();

    const el: HTMLElement = fixture.nativeElement;
    expect(el.textContent).toContain('Bloqueada');
    expect(el.querySelector('.badge--blocked')).not.toBeNull();
  });
});
