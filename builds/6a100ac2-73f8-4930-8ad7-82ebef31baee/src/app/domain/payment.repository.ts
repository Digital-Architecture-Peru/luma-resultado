import { Payment } from './payment.model';

/** Puerto de lectura de pagos; la integración real se implementa como adaptador. */
export abstract class PaymentRepository {
  abstract list(): Promise<Payment[]>;
}
