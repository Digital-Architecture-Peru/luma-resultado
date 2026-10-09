import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { InMemoryCardGateway } from './adapters/in-memory-card.gateway';
import { SEED_CARDS } from './adapters/seed-cards';
import { TransactionFacade } from './application/transaction.facade';
import { CardGateway } from './domain/card.gateway';

const SIMULATED_LATENCY_MS = 400;

/** Único punto de composición: para integrar un backend real, reemplazar el adaptador de CardGateway. */
export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    {
      provide: CardGateway,
      useFactory: () => new InMemoryCardGateway(SEED_CARDS, () => new Date(), SIMULATED_LATENCY_MS),
    },
    { provide: TransactionFacade, useFactory: (gateway: CardGateway) => new TransactionFacade(gateway), deps: [CardGateway] },
  ],
};
