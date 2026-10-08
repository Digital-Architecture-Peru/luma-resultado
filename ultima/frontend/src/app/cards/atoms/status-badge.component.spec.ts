import { ComponentFixture, TestBed } from '@angular/core/testing';
import { StatusBadgeComponent } from './status-badge.component';

describe('StatusBadgeComponent', () => {
  let fixture: ComponentFixture<StatusBadgeComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({ imports: [StatusBadgeComponent] });
    fixture = TestBed.createComponent(StatusBadgeComponent);
  });

  it('given BLOCKED status, when rendered, then shows the text label', () => {
    fixture.componentInstance.status = 'BLOCKED';
    fixture.detectChanges();

    const el = fixture.nativeElement as HTMLElement;
    expect(el.textContent).toContain('Bloqueada');
    expect(el.querySelector('.blocked')).not.toBeNull();
  });

  it('given ACTIVE status, when rendered, then shows Activa', () => {
    fixture.componentInstance.status = 'ACTIVE';
    fixture.detectChanges();

    expect((fixture.nativeElement as HTMLElement).textContent).toContain('Activa');
  });
});
