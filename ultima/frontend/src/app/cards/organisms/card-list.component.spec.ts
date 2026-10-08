import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { CardSummary } from '../data/card.model';
import { CardListComponent } from './card-list.component';

const CARD: CardSummary = {
  id: '11111111-1111-4111-8111-111111111111',
  maskedPan: '**** **** **** 1111',
  brand: 'VISA',
  cardType: 'CREDIT',
  status: 'ACTIVE',
  availableBalance: 3250.75,
  currency: 'USD',
};

describe('CardListComponent', () => {
  let fixture: ComponentFixture<CardListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [CardListComponent],
      providers: [provideRouter([])],
    });
    fixture = TestBed.createComponent(CardListComponent);
  });

  it('given no cards, when rendered, then shows the empty message', () => {
    fixture.componentInstance.cards = [];
    fixture.detectChanges();

    expect((fixture.nativeElement as HTMLElement).textContent).toContain('No tienes tarjetas');
  });

  it('given cards, when rendered, then lists one item per card with masked PAN', () => {
    fixture.componentInstance.cards = [CARD, { ...CARD, id: 'other' }];
    fixture.detectChanges();

    const el = fixture.nativeElement as HTMLElement;
    expect(el.querySelectorAll('li').length).toBe(2);
    expect(el.textContent).toContain('**** **** **** 1111');
  });
});
