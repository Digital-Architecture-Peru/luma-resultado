import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AmountComponent } from './amount.component';

describe('AmountComponent', () => {
  let fixture: ComponentFixture<AmountComponent>;

  beforeEach(() => {
    fixture = TestBed.createComponent(AmountComponent);
  });

  it('given a value and currency when rendered then shows a formatted amount', () => {
    fixture.componentRef.setInput('value', 1234.5);
    fixture.componentRef.setInput('currency', 'USD');
    fixture.componentRef.setInput('locale', 'en-US');
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent.trim()).toBe('$1,234.50');
  });

  it('given an invalid currency code when rendered then falls back without throwing', () => {
    fixture.componentRef.setInput('value', 10);
    fixture.componentRef.setInput('currency', 'invalid!');
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent).toContain('10.00');
  });
});
