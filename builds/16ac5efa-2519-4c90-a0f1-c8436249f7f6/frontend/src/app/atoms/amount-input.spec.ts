import { TestBed } from '@angular/core/testing';
import { FormControl } from '@angular/forms';
import { AmountInputComponent } from './amount-input.component';
import { amountValidator } from './amount.validator';

describe('amountValidator', () => {
  const check = (value: string) => amountValidator(new FormControl(value));

  it('given empty value then no error (required is separate)', () => {
    expect(check('')).toBeNull();
  });

  it.each(['1', '10.5', '0.01', '1234567890123.99'])('given %s then valid', (v) => {
    expect(check(v)).toBeNull();
  });

  it.each(['abc', '1.234', '-5', '1,5', '1.'])('given %s then amountFormat error', (v) => {
    expect(check(v)).toEqual({ amountFormat: true });
  });

  it.each(['0', '0.00'])('given %s then amountPositive error', (v) => {
    expect(check(v)).toEqual({ amountPositive: true });
  });
});

describe('AmountInputComponent', () => {
  it('given a control when user types then the control value updates', () => {
    const fixture = TestBed.createComponent(AmountInputComponent);
    const control = new FormControl('', { nonNullable: true });
    fixture.componentInstance.control = control;
    fixture.componentInstance.inputId = 'amount';
    fixture.detectChanges();

    const input: HTMLInputElement = fixture.nativeElement.querySelector('input');
    input.value = '12.30';
    input.dispatchEvent(new Event('input'));

    expect(input.id).toBe('amount');
    expect(control.value).toBe('12.30');
  });
});
