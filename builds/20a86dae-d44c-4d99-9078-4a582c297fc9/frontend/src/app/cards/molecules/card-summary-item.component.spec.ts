import { TestBed } from '@angular/core/testing';
import { CardSummaryItemComponent } from './card-summary-item.component';
import { CardSummary } from '../data/card.model';

describe('CardSummaryItemComponent', () => {
  const card: CardSummary = {
    id: 'abc',
    maskedPan: '**** **** **** 4821',
    type: 'CREDIT',
    status: 'ACTIVE',
    availableBalance: 3250.75,
    currency: 'USD',
  };

  it('given a card, when rendered, then shows masked PAN and formatted balance', () => {
    const fixture = TestBed.createComponent(CardSummaryItemComponent);
    fixture.componentRef.setInput('card', card);
    fixture.detectChanges();
    const text = (fixture.nativeElement as HTMLElement).textContent ?? '';
    expect(text).toContain('**** **** **** 4821');
    expect(text).toContain('3,250.75');
  });

  it('given a card, when clicked, then emits its id', () => {
    const fixture = TestBed.createComponent(CardSummaryItemComponent);
    fixture.componentRef.setInput('card', card);
    fixture.detectChanges();
    let emitted = '';
    fixture.componentInstance.chosen.subscribe((id: string) => (emitted = id));
    (fixture.nativeElement as HTMLElement).querySelector('button')?.click();
    expect(emitted).toBe('abc');
  });
});
