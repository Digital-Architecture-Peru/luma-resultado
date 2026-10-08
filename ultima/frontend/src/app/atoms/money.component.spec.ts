import { TestBed } from '@angular/core/testing';
import { MoneyComponent } from './money.component';

describe('MoneyComponent', () => {
  it('given an amount in USD when rendering then formats with two decimals', () => {
    const fixture = TestBed.createComponent(MoneyComponent);
    fixture.componentRef.setInput('amount', 1234.5);
    fixture.componentRef.setInput('currency', 'USD');
    fixture.detectChanges();

    expect((fixture.nativeElement as HTMLElement).textContent).toContain('$1,234.50');
  });
});
