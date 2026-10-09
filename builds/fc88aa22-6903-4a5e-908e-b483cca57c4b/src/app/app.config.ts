import { ApplicationConfig } from '@angular/core';
import { AccountRepository } from './core/account.repository';
import { InMemoryAccountRepository } from './core/in-memory-account.repository';

// Único punto de composición: cambiar el adaptador cuando la integración esté definida.
export const appConfig: ApplicationConfig = {
  providers: [{ provide: AccountRepository, useClass: InMemoryAccountRepository }],
};
