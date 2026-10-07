import { ApplicationConfig } from '@angular/core';
import { CardRepository } from './domain/card.repository';
import { InMemoryCardRepository } from './infrastructure/in-memory-card.repository';

/** Único punto de composición: aquí se cambia el adaptador de datos. */
export const appConfig: ApplicationConfig = {
  providers: [{ provide: CardRepository, useClass: InMemoryCardRepository }],
};
