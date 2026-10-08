import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { of, throwError } from 'rxjs';
import { CardsPageComponent } from './cards-page.component';
import { CardsApiService } from '../core/cards-api.service';
import { Card } from '../core/models';

const card: Card = {
  id: 'c1',
  maskedPan: '**** 4242',
  brand: 'VISA',
  product: 'Clásica',
  status: 'Active',
  creditLimit: 5000,
  available: 3200.5,
  currency: 'USD',
  expiry: '07/28',
};

function setup(list: jest.Mock) {
  TestBed.configureTestingModule({
    providers: [provideRouter([]), { provide: CardsApiService, useValue: { list } }],
  });
  const fixture = TestBed.createComponent(CardsPageComponent);
  fixture.detectChanges();
  return fixture.nativeElement as HTMLElement;
}

describe('CardsPageComponent', () => {
  it('given the API returns cards when loading then renders them', () => {
    const el = setup(jest.fn(() => of([card])));
    expect(el.textContent).toContain('**** 4242');
  });

  it('given the API fails when loading then shows an error alert', () => {
    const el = setup(jest.fn(() => throwError(() => new Error('boom'))));
    expect(el.querySelector('[role="alert"]')?.textContent).toContain('No se pudo cargar');
  });
});
