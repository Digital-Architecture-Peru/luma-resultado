import { TestBed } from '@angular/core/testing';
import { UiBadgeComponent } from './badge.component';

describe('UiBadgeComponent', () => {
  it('given tone success then applies the success class', () => {
    const fixture = TestBed.createComponent(UiBadgeComponent);
    fixture.componentRef.setInput('tone', 'success');
    fixture.detectChanges();
    const span = fixture.nativeElement.querySelector('span') as HTMLElement;
    expect(span.classList).toContain('badge--success');
  });

  it('given no tone then uses neutral', () => {
    const fixture = TestBed.createComponent(UiBadgeComponent);
    fixture.detectChanges();
    expect((fixture.nativeElement.querySelector('span') as HTMLElement).classList).toContain('badge--neutral');
  });
});
