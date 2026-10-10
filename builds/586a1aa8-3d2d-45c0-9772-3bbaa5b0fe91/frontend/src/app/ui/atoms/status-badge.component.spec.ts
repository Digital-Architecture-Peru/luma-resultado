import { ComponentFixture, TestBed } from '@angular/core/testing';
import { StatusBadgeComponent } from './status-badge.component';

describe('StatusBadgeComponent', () => {
  let fixture: ComponentFixture<StatusBadgeComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({ imports: [StatusBadgeComponent] });
    fixture = TestBed.createComponent(StatusBadgeComponent);
  });

  it('shows "Nueva" for unread notifications', () => {
    fixture.componentRef.setInput('status', 'UNREAD');
    fixture.detectChanges();

    const badge: HTMLElement = fixture.nativeElement.querySelector('.badge');
    expect(badge.textContent?.trim()).toBe('Nueva');
    expect(badge.classList).toContain('badge--unread');
  });

  it('shows "Leída" for read notifications', () => {
    fixture.componentRef.setInput('status', 'READ');
    fixture.detectChanges();

    const badge: HTMLElement = fixture.nativeElement.querySelector('.badge');
    expect(badge.textContent?.trim()).toBe('Leída');
    expect(badge.classList).not.toContain('badge--unread');
  });
});
