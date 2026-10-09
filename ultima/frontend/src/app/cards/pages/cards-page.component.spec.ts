import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { of, throwError } from 'rxjs';
import { CardApiService } from '../data/card-api.service';
import { CardSummary } from '../data/card.model';
import { CardsPageComponent } from './cards-page.component';

describe('CardsPageComponent', () => {
  const card: CardSummary = {
    id: '1', alias: 'Visa Demo', maskedPan: '**** **** **** 4242', type: 'CREDIT', brand: 'VISA', status: 'ACTIVE',
  };

  function setup(list: () => ReturnType<CardApiService['list']>): HTMLElement {
    TestBed.configureTestingModule({
      providers: [provideRouter([]), { provide: CardApiService, useValue: { list } }],
    });
    const fixture = TestBed.createComponent(CardsPageComponent);
    fixture.detectChanges();
    return fixture.nativeElement;
  }

  it('renders the cards returned by the API', () => {
    const el = setup(() => of([card]));
    expect(el.textContent).toContain('Visa Demo');
    expect(el.textContent).toContain('**** **** **** 4242');
  });

  it('shows an empty message when there are no cards', () => {
    const el = setup(() => of([]));
    expect(el.textContent).toContain('No tienes tarjetas registradas.');
  });

  it('shows an alert when the API fails', () => {
    const el = setup(() => throwError(() => new Error('boom')));
    expect(el.querySelector('[role="alert"]')).not.toBeNull();
  });
});
