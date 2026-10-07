import { TestBed } from '@angular/core/testing';
import { Card } from '../../../core/cards/models/card.model';
import { CardSummary } from './card-summary';

const CARD: Card = {
  id: 'x-1', alias: 'Visa Test', maskedNumber: '**** 9999', holder: 'DEMO',
  type: 'CREDIT', brand: 'Visa', status: 'ACTIVE', expiry: '01/30',
  availableBalance: 100, currency: 'USD',
};

describe('CardSummary', () => {
  it('given a card when rendered then shows alias, masked number and status', () => {
    const fixture = TestBed.createComponent(CardSummary);
    fixture.componentRef.setInput('card', CARD);
    fixture.detectChanges();
    const text = (fixture.nativeElement as HTMLElement).textContent ?? '';
    expect(text).toContain('Visa Test');
    expect(text).toContain('**** 9999');
    expect(text).toContain('Activa');
  });

  it('given a click on detail button when pressed then emits the card id', () => {
    const fixture = TestBed.createComponent(CardSummary);
    fixture.componentRef.setInput('card', CARD);
    fixture.detectChanges();
    const emitted: string[] = [];
    fixture.componentInstance.selected.subscribe((id) => emitted.push(id));
    (fixture.nativeElement as HTMLElement).querySelector('button')?.click();
    expect(emitted).toEqual(['x-1']);
  });
});
