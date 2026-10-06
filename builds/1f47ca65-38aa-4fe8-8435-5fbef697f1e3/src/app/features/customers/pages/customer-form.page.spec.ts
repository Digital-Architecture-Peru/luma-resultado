import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router, provideRouter } from '@angular/router';
import { CustomerFormPage } from './customer-form.page';
import { CUSTOMERS_REPOSITORY } from '../data/customers.repository';
import { InMemoryCustomersRepository } from '../data/in-memory-customers.repository';
import { FAKE_CUSTOMERS } from '../../../../testing/fixtures/customers.fixture';

describe('CustomerFormPage', () => {
  let repo: InMemoryCustomersRepository;
  let fixture: ComponentFixture<CustomerFormPage>;
  let router: Router;

  async function create(id?: string) {
    repo = new InMemoryCustomersRepository(FAKE_CUSTOMERS);
    await TestBed.configureTestingModule({
      imports: [CustomerFormPage],
      providers: [provideRouter([]), { provide: CUSTOMERS_REPOSITORY, useValue: repo }],
    }).compileComponents();
    router = TestBed.inject(Router);
    spyOn(router, 'navigate').and.resolveTo(true);
    fixture = TestBed.createComponent(CustomerFormPage);
    if (id) fixture.componentRef.setInput('id', id);
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();
  }

  it('given empty form when submit then is invalid and nothing is created', async () => {
    await create();
    await fixture.componentInstance.submit();
    expect(fixture.componentInstance.form.invalid).toBeTrue();
    expect((await repo.list()).length).toBe(3);
    expect(router.navigate).not.toHaveBeenCalled();
  });

  it('given invalid email when validating then email control is invalid', async () => {
    await create();
    const email = fixture.componentInstance.form.controls.email;
    email.setValue('no-es-correo');
    expect(email.invalid).toBeTrue();
    email.setValue('ok@example.com');
    expect(email.valid).toBeTrue();
  });

  it('given valid data when submit then creates customer and navigates to list', async () => {
    await create();
    fixture.componentInstance.form.setValue({
      name: 'Fede Nuevo', email: 'fede@example.com', phone: '+00 333 0000', city: 'Ciudad Cuatro',
    });
    await fixture.componentInstance.submit();
    expect((await repo.list()).length).toBe(4);
    expect(router.navigate).toHaveBeenCalledWith(['/clientes']);
  });

  it('given duplicate email when submit then shows error and stays', async () => {
    await create();
    fixture.componentInstance.form.setValue({
      name: 'Dup', email: 'ana@example.com', phone: '+00 333 0000', city: 'X',
    });
    await fixture.componentInstance.submit();
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent).toContain('Ya existe un cliente');
    expect(router.navigate).not.toHaveBeenCalled();
  });

  it('given an id when editing then prefills the form and saves changes', async () => {
    await create('c-2');
    expect(fixture.componentInstance.form.getRawValue().name).toBe('Beto Muestra');
    fixture.componentInstance.form.patchValue({ city: 'Ciudad Nueva' });
    await fixture.componentInstance.submit();
    expect((await repo.get('c-2'))?.city).toBe('Ciudad Nueva');
  });

  it('given unknown id when editing then shows not-found message', async () => {
    await create('nope');
    expect(fixture.nativeElement.textContent).toContain('no existe');
  });
});
