import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { ACCOUNTS_QUERY } from './core/accounts/accounts-query.port';
import { InMemoryAccountsAdapter } from './core/accounts/in-memory-accounts.adapter';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    // Único punto donde se elige el adaptador; reemplazable por HTTP sin tocar componentes.
    { provide: ACCOUNTS_QUERY, useClass: InMemoryAccountsAdapter },
  ],
};
