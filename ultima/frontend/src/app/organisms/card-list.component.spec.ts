import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { CardListComponent } from './card-list.component';
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

describe('CardListComponent', () => {
  beforeEach(() => TestBed.configureTestingModule({ providers: [provideRouter([])] }));

  it('given cards when rendering then shows each masked PAN', () => {
    const fixture = TestBed.createComponent(CardListComponent);
    fixture.componentRef.setInput('cards', [card]);
    fixture.detectChanges();

    const el: HTMLElement = fixture.nativeElement;
    expect(el.textContent).toContain('**** 4242');
    expect(el.querySelectorAll('li').length).toBe(1);
  });

  it('given no cards when rendering then shows the empty state', () => {
    const fixture = TestBed.createComponent(CardListComponent);
    fixture.componentRef.setInput('cards', []);
    fixture.detectChanges();

    expect((fixture.nativeElement as HTMLElement).textContent).toContain('No tienes tarjetas');
  });
});
