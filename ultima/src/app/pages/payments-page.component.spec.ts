import { provideZonelessChangeDetection } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { beforeEach, describe, expect, it } from 'vitest';
import { Payment } from '../domain/payment.model';
import { PaymentRepository } from '../domain/payment.repository';
import { SAMPLE_PAYMENTS } from '../infrastructure/mock-payment.repository';
import { PaymentsPageComponent } from './payments-page.component';

class FakeRepository extends PaymentRepository {
  constructor(private readonly behavior: () => Promise<Payment[]>) {
    super();
  }
  override list(): Promise<Payment[]> {
    return this.behavior();
  }
}

function setup(behavior: () => Promise<Payment[]>) {
  TestBed.configureTestingModule({
    providers: [
      provideZonelessChangeDetection(),
      { provide: PaymentRepository, useValue: new FakeRepository(behavior) },
    ],
  });
  const fixture = TestBed.createComponent(PaymentsPageComponent);
  return { fixture, el: fixture.nativeElement as HTMLElement };
}

describe('PaymentsPageComponent', () => {
  beforeEach(() => TestBed.resetTestingModule());

  it('given repositorio con datos when carga then lista todos los pagos', async () => {
    const { fixture, el } = setup(() => Promise.resolve([...SAMPLE_PAYMENTS]));
    await fixture.whenStable();
    expect(el.querySelectorAll('tbody tr').length).toBe(SAMPLE_PAYMENTS.length);
    expect(el.querySelector('[role="status"]')?.textContent).toContain(`${SAMPLE_PAYMENTS.length} de ${SAMPLE_PAYMENTS.length}`);
  });

  it('given texto de búsqueda when escribe then filtra la tabla', async () => {
    const { fixture, el } = setup(() => Promise.resolve([...SAMPLE_PAYMENTS]));
    await fixture.whenStable();
    const input = el.querySelector('#search') as HTMLInputElement;
    input.value = 'seguros';
    input.dispatchEvent(new Event('input'));
    await fixture.whenStable();
    expect(el.querySelectorAll('tbody tr').length).toBe(1);
    expect(el.textContent).toContain('Seguros Demo');
  });

  it('given búsqueda sin resultados when filtra then muestra estado vacío', async () => {
    const { fixture, el } = setup(() => Promise.resolve([...SAMPLE_PAYMENTS]));
    await fixture.whenStable();
    const input = el.querySelector('#search') as HTMLInputElement;
    input.value = 'no-existe';
    input.dispatchEvent(new Event('input'));
    await fixture.whenStable();
    expect(el.querySelector('.empty')).not.toBeNull();
  });

  it('given repositorio que falla when carga then muestra alerta de error', async () => {
    const { fixture, el } = setup(() => Promise.reject(new Error('fallo simulado')));
    await fixture.whenStable();
    expect(el.querySelector('[role="alert"]')?.textContent).toContain('No pudimos cargar');
  });
});
