import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { CustomersListPage } from './customers-list.page';
import { CUSTOMERS_REPOSITORY } from '../data/customers.repository';
import { InMemoryCustomersRepository } from '../data/in-memory-customers.repository';
import { FAKE_CUSTOMERS } from '../../../../testing/fixtures/customers.fixture';

describe('CustomersListPage', () => {
  let fixture: ComponentFixture<CustomersListPage>;
  let el: HTMLElement;

  const rows = () => el.querySelectorAll('[data-testid="row"]');

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CustomersListPage],
      providers: [
        provideRouter([]),
        { provide: CUSTOMERS_REPOSITORY, useValue: new InMemoryCustomersRepository(FAKE_CUSTOMERS) },
      ],
    }).compileComponents();
    fixture = TestBed.createComponent(CustomersListPage);
    el = fixture.nativeElement;
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();
  });

  it('given customers when page loads then renders one row each', () => {
    expect(rows().length).toBe(3);
    expect(el.textContent).toContain('Ana Ejemplo');
  });

  it('given a search term when typing then filters rows', () => {
    const input = el.querySelector('#search') as HTMLInputElement;
    input.value = 'carla';
    input.dispatchEvent(new Event('input'));
    fixture.detectChanges();
    expect(rows().length).toBe(1);
    expect(el.textContent).toContain('Carla Prueba');
  });

  it('given no matches when searching then shows empty state', () => {
    const input = el.querySelector('#search') as HTMLInputElement;
    input.value = 'zzzz';
    input.dispatchEvent(new Event('input'));
    fixture.detectChanges();
    expect(rows().length).toBe(0);
    expect(el.querySelector('[data-testid="empty"]')).not.toBeNull();
  });

  it('given delete clicked when confirmed then row is removed; cancel keeps it', async () => {
    const buttons = () => Array.from(el.querySelectorAll('button')) as HTMLButtonElement[];
    const find = (text: string) => buttons().find((b) => b.textContent?.trim() === text)!;

    find('Eliminar').click();
    fixture.detectChanges();
    find('Cancelar').click();
    fixture.detectChanges();
    expect(rows().length).toBe(3);

    find('Eliminar').click();
    fixture.detectChanges();
    find('Confirmar').click();
    await fixture.whenStable();
    fixture.detectChanges();
    expect(rows().length).toBe(2);
    expect(el.textContent).not.toContain('Ana Ejemplo');
  });
});
