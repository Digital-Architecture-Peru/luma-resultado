import { registerLocaleData } from '@angular/common';
import localeEsPe from '@angular/common/locales/es-PE';
import { ApplicationConfig, LOCALE_ID, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { environment } from '../environments/environment';
import { ACCOUNTS_GATEWAY } from './core/accounts/accounts.gateway';
import { InMemoryAccountsGateway } from './core/accounts/in-memory.gateway';
import { routes } from './app.routes';

registerLocaleData(localeEsPe);

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    { provide: LOCALE_ID, useValue: environment.locale },
    InMemoryAccountsGateway,
    {
      provide: ACCOUNTS_GATEWAY,
      useFactory: (mock: InMemoryAccountsGateway) => {
        if (!environment.useMockGateway) {
          throw new Error('No hay adaptador real de cuentas configurado (integración: Ninguna).');
        }
        return mock;
      },
      deps: [InMemoryAccountsGateway],
    },
  ],
};
