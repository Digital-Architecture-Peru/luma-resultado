import { ApplicationConfig, inject, provideZoneChangeDetection } from '@angular/core';
import { InMemoryPaymentGateway, PaymentGateway } from './domain/payment-gateway';
import { PaymentFlow } from './domain/payment-flow';

/** Único punto de composición: aquí se cambia el adaptador cuando la integración esté definida. */
export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    { provide: PaymentGateway, useFactory: () => new InMemoryPaymentGateway() },
    { provide: PaymentFlow, useFactory: () => new PaymentFlow(inject(PaymentGateway)) },
  ],
};
