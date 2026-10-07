import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { routes } from './app.routes';
import { CardsRepository } from './core/cards/ports/cards.repository';
import { MockCardsAdapter } from './core/cards/adapters/mock-cards.adapter';
import { CURRENCY_CODE } from './shared/tokens';
import { environment } from '../environments/environment';

function cardsRepositoryFactory(): CardsRepository {
  if (!environment.useMock) {
    throw new Error('Adaptador HTTP de tarjetas pendiente: contrato de integración sin definir.');
  }
  return new MockCardsAdapter();
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes, withComponentInputBinding()),
    { provide: CardsRepository, useFactory: cardsRepositoryFactory },
    { provide: CURRENCY_CODE, useValue: environment.currency },
  ],
};
