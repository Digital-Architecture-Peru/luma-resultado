import { ApplicationConfig, provideZonelessChangeDetection } from '@angular/core';
import { PaymentRepository } from './domain/payment.repository';
import { MockPaymentRepository } from './infrastructure/mock-payment.repository';

// Único punto de composición: para integrar un servicio real basta con
// sustituir useClass por un adaptador HTTP que implemente PaymentRepository.
export const appConfig: ApplicationConfig = {
  providers: [
    provideZonelessChangeDetection(),
    { provide: PaymentRepository, useClass: MockPaymentRepository },
  ],
};
