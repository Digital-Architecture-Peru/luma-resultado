import { TestBed } from '@angular/core/testing';
import { UiAmountSummaryComponent } from './amount-summary.component';

describe('UiAmountSummaryComponent', () => {
  it('given cents then shows label and formatted amount', () => {
    const fixture = TestBed.createComponent(UiAmountSummaryComponent);
    fixture.componentRef.setInput('label', 'Monto');
    fixture.componentRef.setInput('amountCents', 123456);
    fixture.detectChanges();
    const text = (fixture.nativeElement as HTMLElement).textContent ?? '';
    expect(text).toContain('Monto');
    expect(text).toMatch(/1,234\.56/);
  });
});
