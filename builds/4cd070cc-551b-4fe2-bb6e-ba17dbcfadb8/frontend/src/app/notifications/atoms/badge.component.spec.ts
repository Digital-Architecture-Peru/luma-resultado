import { TestBed } from '@angular/core/testing';
import { BadgeComponent } from './badge.component';

describe('BadgeComponent', () => {
  function render(count: number): HTMLElement {
    const fixture = TestBed.createComponent(BadgeComponent);
    fixture.componentInstance.count = count;
    fixture.detectChanges();
    return fixture.nativeElement as HTMLElement;
  }

  it('given zero when rendered then shows nothing', () => {
    expect(render(0).querySelector('.badge')).toBeNull();
  });

  it('given a count when rendered then shows it with accessible label', () => {
    const el = render(4).querySelector('.badge');
    expect(el?.textContent?.trim()).toBe('4');
    expect(el?.getAttribute('aria-label')).toBe('4 notificaciones sin leer');
  });

  it('given more than 99 when rendered then caps the label', () => {
    expect(render(150).querySelector('.badge')?.textContent?.trim()).toBe('99+');
  });
});
