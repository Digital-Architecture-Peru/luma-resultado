import { TestBed } from '@angular/core/testing';
import { AmountTextComponent } from './amount-text.component';
import { BadgeComponent } from './badge.component';

describe('atoms', () => {
  it('given amount and currency, when rendered, then formats with two decimals', () => {
    const fixture = TestBed.createComponent(AmountTextComponent);
    fixture.componentRef.setInput('amount', 45);
    fixture.componentRef.setInput('currency', 'USD');
    fixture.detectChanges();

    expect((fixture.nativeElement as HTMLElement).textContent).toContain('USD 45.00');
  });

  it('given a tone, when badge rendered, then applies the tone class and label', () => {
    const fixture = TestBed.createComponent(BadgeComponent);
    fixture.componentRef.setInput('label', 'Sin leer');
    fixture.componentRef.setInput('tone', 'danger');
    fixture.detectChanges();

    const span = (fixture.nativeElement as HTMLElement).querySelector('span');
    expect(span?.className).toContain('badge--danger');
    expect(span?.textContent).toBe('Sin leer');
  });
});
