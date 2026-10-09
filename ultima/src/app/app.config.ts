import { ApplicationConfig } from '@angular/core';
import { InMemoryCardRepository } from './adapters/in-memory-card.repository';
import { CARD_REPOSITORY } from './domain/card.repository.token';

/** Único punto de composición: aquí se sustituye el adaptador cuando se defina la integración. */
export const appConfig: ApplicationConfig = {
  providers: [{ provide: CARD_REPOSITORY, useFactory: () => new InMemoryCardRepository() }],
};
