import { TestBed } from '@angular/core/testing';
import { Amount } from './amount';
import { CardNumber } from './card-number';
import { StatusBadge } from './status-badge';

describe('atoms', () => {
  it('given status BLOCKED when rendered then shows Bloqueada label', () => {
    const fixture = TestBed.createComponent(StatusBadge);
    fixture.componentRef.setInput('status', 'BLOCKED');
    fixture.detectChanges();
    const el = fixture.nativeElement as HTMLElement;
    expect(el.textContent).toContain('Bloqueada');
    expect(el.querySelector('.blocked')).not.toBeNull();
  });

  it('given a positive amount when rendered then formats with two decimals', () => {
    const fixture = TestBed.createComponent(Amount);
    fixture.componentRef.setInput('value', 25);
    fixture.detectChanges();
    expect((fixture.nativeElement as HTMLElement).textContent).toContain('25,00');
  });

  it('given a negative amount when rendered then applies negative class', () => {
    const fixture = TestBed.createComponent(Amount);
    fixture.componentRef.setInput('value', -10);
    fixture.detectChanges();
    expect((fixture.nativeElement as HTMLElement).querySelector('.negative')).not.toBeNull();
  });

  it('given a full PAN when rendered then it is masked', () => {
    const fixture = TestBed.createComponent(CardNumber);
    fixture.componentRef.setInput('value', '4111111111111234');
    fixture.detectChanges();
    const text = (fixture.nativeElement as HTMLElement).textContent ?? '';
    expect(text).toContain('**** 1234');
    expect(text).not.toContain('4111');
  });
});
