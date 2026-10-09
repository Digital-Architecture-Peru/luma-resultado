import { ApplicationConfig } from '@angular/core';
import { AccountsGateway } from './core/ports/accounts.gateway';
import { InMemoryAccountsGateway } from './core/adapters/in-memory-accounts.gateway';

// Único punto de composición: la integración real (API) está sin definir,
// por lo que se enlaza el adaptador en memoria con datos ficticios.
export const appConfig: ApplicationConfig = {
  providers: [{ provide: AccountsGateway, useClass: InMemoryAccountsGateway }],
};
