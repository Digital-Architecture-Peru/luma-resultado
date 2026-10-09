import { ApplicationConfig } from '@angular/core';
import { PaymentGateway } from './core/payment.gateway';
import { InMemoryPaymentGateway } from './core/in-memory-payment.gateway';

/** Único punto de composición: aquí se cambia el adaptador (p. ej. HTTP) sin tocar la UI. */
export const appConfig: ApplicationConfig = {
  providers: [{ provide: PaymentGateway, useClass: InMemoryPaymentGateway }],
};
