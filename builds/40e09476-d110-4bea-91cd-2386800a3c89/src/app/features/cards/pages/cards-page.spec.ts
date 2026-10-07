import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { CardsPage } from './cards-page';
import { CardsRepository } from '../../../core/cards/ports/cards.repository';
import { MockCardsAdapter } from '../../../core/cards/adapters/mock-cards.adapter';

describe('CardsPage', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [{ provide: CardsRepository, useClass: MockCardsAdapter }],
    });
  });

  it('given mock data when created then lists the cards', () => {
    const fixture = TestBed.createComponent(CardsPage);
    fixture.detectChanges();
    const el = fixture.nativeElement as HTMLElement;
    expect(el.querySelectorAll('app-card-summary').length).toBe(3);
    expect(el.textContent).toContain('Visa Oro');
  });

  it('given a listed card when detail button is clicked then navigates to its detail', () => {
    const router = TestBed.inject(Router);
    const navigate = vi.spyOn(router, 'navigate').mockResolvedValue(true);
    const fixture = TestBed.createComponent(CardsPage);
    fixture.detectChanges();
    (fixture.nativeElement as HTMLElement).querySelector('button')?.click();
    expect(navigate).toHaveBeenCalledWith(['/tarjetas', 'c-001']);
  });
});
