import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { HttpClient, provideHttpClient } from '@angular/common/http';
import { routes } from './app.routes';
import { environment } from '../environments/environment';
import { CUSTOMERS_REPOSITORY } from './features/customers/data/customers.repository';
import { InMemoryCustomersRepository } from './features/customers/data/in-memory-customers.repository';
import { HttpCustomersRepository } from './features/customers/data/http-customers.repository';
import { FAKE_CUSTOMERS } from '../testing/fixtures/customers.fixture';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes, withComponentInputBinding()),
    provideHttpClient(),
    {
      provide: CUSTOMERS_REPOSITORY,
      useFactory: (http: HttpClient) =>
        environment.repository === 'http'
          ? new HttpCustomersRepository(http, environment.apiBaseUrl)
          : new InMemoryCustomersRepository(FAKE_CUSTOMERS),
      deps: [HttpClient],
    },
  ],
};
