import { ComponentFixture, TestBed } from '@angular/core/testing';
import { StatusBadgeComponent } from './status-badge.component';

describe('StatusBadgeComponent', () => {
  let fixture: ComponentFixture<StatusBadgeComponent>;

  beforeEach(() => {
    fixture = TestBed.createComponent(StatusBadgeComponent);
  });

  it('given BLOCKED status, when rendered, then shows Bloqueada', () => {
    fixture.componentRef.setInput('status', 'BLOCKED');
    fixture.detectChanges();
    expect((fixture.nativeElement as HTMLElement).textContent).toContain('Bloqueada');
  });

  it('given ACTIVE status, when rendered, then shows Activa', () => {
    fixture.componentRef.setInput('status', 'ACTIVE');
    fixture.detectChanges();
    expect((fixture.nativeElement as HTMLElement).textContent).toContain('Activa');
  });
});
