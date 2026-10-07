import { ApplicationConfig, provideZonelessChangeDetection } from '@angular/core';
import { CardsGateway } from './domain/cards.gateway';
import { InMemoryCardsGateway } from './infrastructure/in-memory-cards.gateway';

// Único punto de composición: para integrar un backend real basta
// sustituir InMemoryCardsGateway por un adaptador HTTP que implemente CardsGateway.
export const appConfig: ApplicationConfig = {
  providers: [
    provideZonelessChangeDetection(),
    { provide: CardsGateway, useClass: InMemoryCardsGateway },
  ],
};
