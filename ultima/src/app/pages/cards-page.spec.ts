import { TestBed } from '@angular/core/testing';
import { Observable, of, throwError } from 'rxjs';
import { Card } from '../domain/card.model';
import { CardRepository } from '../domain/card.repository';
import { CardsPageComponent } from './cards-page.component';

const card = (id: string, holder: string, status: Card['status']): Card => ({
  id, holder, last4: '1234', brand: 'Visa', status, expiry: '01/30',
  creditLimit: 1000, balance: 100, currency: 'USD',
});

function render(source: Observable<Card[]>) {
  TestBed.configureTestingModule({
    providers: [{ provide: CardRepository, useValue: { list: () => source } }],
  });
  const fixture = TestBed.createComponent(CardsPageComponent);
  fixture.detectChanges();
  return { fixture, root: fixture.nativeElement as HTMLElement };
}

describe('CardsPageComponent', () => {
  it('given repository data when loaded then lists masked cards and count', () => {
    const { root } = render(of([card('1', 'Alfa', 'ACTIVE'), card('2', 'Beta', 'BLOCKED')]));

    expect(root.querySelectorAll('app-card-item')).toHaveLength(2);
    expect(root.textContent).toContain('•••• •••• •••• 1234');
    expect(root.querySelector('[role="status"]')?.textContent).toContain('2 de 2 tarjetas');
  });

  it('given a search text when typing then only matching cards remain', () => {
    const { fixture, root } = render(of([card('1', 'Alfa', 'ACTIVE'), card('2', 'Beta', 'ACTIVE')]));
    const input = root.querySelector('input[name="text"]') as HTMLInputElement;

    input.value = 'beta';
    input.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    expect(root.querySelectorAll('app-card-item')).toHaveLength(1);
    expect(root.textContent).toContain('Beta');
  });

  it('given a status selection when changed then filters by status and shows empty state', () => {
    const { fixture, root } = render(of([card('1', 'Alfa', 'ACTIVE')]));
    const select = root.querySelector('select[name="status"]') as HTMLSelectElement;

    select.value = 'EXPIRED';
    select.dispatchEvent(new Event('change'));
    fixture.detectChanges();

    expect(root.querySelectorAll('app-card-item')).toHaveLength(0);
    expect(root.textContent).toContain('No se encontraron tarjetas');
  });

  it('given repository failure when loading then shows error message', () => {
    const { root } = render(throwError(() => new Error('fallo')));

    expect(root.querySelector('[role="status"]')?.textContent).toContain('No fue posible');
    expect(root.querySelectorAll('app-card-item')).toHaveLength(0);
  });
});
