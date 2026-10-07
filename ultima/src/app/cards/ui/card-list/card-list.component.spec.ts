import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { Observable, of, throwError } from 'rxjs';
import { CardListComponent } from './card-list.component';
import { CardsGateway } from '../../data/cards.gateway';
import { MockCardsGateway } from '../../data/mock-cards.gateway';
import { Card } from '../../domain/card.model';

class EmptyGateway extends CardsGateway {
  list(): Observable<Card[]> { return of([]); }
  getById(): Observable<Card | null> { return of(null); }
}

class FailingGateway extends CardsGateway {
  list(): Observable<Card[]> { return throwError(() => new Error('boom')); }
  getById(): Observable<Card | null> { return throwError(() => new Error('boom')); }
}

function render(gateway: new () => CardsGateway): HTMLElement {
  TestBed.configureTestingModule({
    imports: [CardListComponent],
    providers: [provideRouter([]), { provide: CardsGateway, useClass: gateway }],
  });
  const fixture: ComponentFixture<CardListComponent> = TestBed.createComponent(CardListComponent);
  fixture.detectChanges();
  return fixture.nativeElement as HTMLElement;
}

describe('CardListComponent', () => {
  it('given cards, when rendered, then lists each card with a masked PAN', () => {
    const el = render(MockCardsGateway);
    expect(el.querySelectorAll('li.card').length).toBe(3);
    const text = el.textContent ?? '';
    expect(text).toContain('**** 1111');
    expect(text).not.toContain('4000000000001111');
  });

  it('given no cards, when rendered, then shows the empty state', () => {
    const el = render(EmptyGateway);
    expect(el.querySelector('[role="status"]')?.textContent).toContain('No tiene tarjetas');
  });

  it('given a failing gateway, when rendered, then shows an alert with retry button', () => {
    const el = render(FailingGateway);
    expect(el.querySelector('[role="alert"]')).not.toBeNull();
    expect(el.querySelector('button')?.textContent).toContain('Reintentar');
  });
});
