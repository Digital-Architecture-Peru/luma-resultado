import { Injectable } from '@angular/core';
import { Payment } from '../domain/payment.model';
import { PaymentRepository } from '../domain/payment.repository';

export const SAMPLE_PAYMENTS: readonly Payment[] = [
  { id: 'PAG-1001', date: '2026-10-08', beneficiary: 'Empresa Eléctrica Demo', concept: 'Servicio de luz septiembre', amount: 84.5, currency: 'USD', status: 'COMPLETED' },
  { id: 'PAG-1002', date: '2026-10-07', beneficiary: 'Agua Potable Demo', concept: 'Servicio de agua', amount: 23.1, currency: 'USD', status: 'COMPLETED' },
  { id: 'PAG-1003', date: '2026-10-05', beneficiary: 'Colegio Ejemplo', concept: 'Pensión octubre', amount: 310, currency: 'USD', status: 'PENDING' },
  { id: 'PAG-1004', date: '2026-10-02', beneficiary: 'Telecom Ficticia', concept: 'Plan móvil', amount: 35.9, currency: 'USD', status: 'REJECTED' },
  { id: 'PAG-1005', date: '2026-09-28', beneficiary: 'Seguros Demo', concept: 'Prima mensual', amount: 120, currency: 'USD', status: 'COMPLETED' },
  { id: 'PAG-1006', date: '2026-09-21', beneficiary: 'Tarjeta Ejemplo', concept: 'Pago de tarjeta', amount: 450.75, currency: 'USD', status: 'PENDING' },
];

/** Adaptador en memoria con datos ficticios; sin red ni persistencia. */
@Injectable()
export class MockPaymentRepository extends PaymentRepository {
  override list(): Promise<Payment[]> {
    return Promise.resolve([...SAMPLE_PAYMENTS]);
  }
}
