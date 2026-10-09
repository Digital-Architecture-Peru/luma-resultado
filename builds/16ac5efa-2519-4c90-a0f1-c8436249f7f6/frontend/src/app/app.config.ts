import { ApplicationConfig } from '@angular/core';
import { provideHttpClient } from '@angular/common/http';
import { API_BASE_URL } from './core/api-config';

export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(),
    // Relativo: en desarrollo lo resuelve proxy.conf.json; en despliegue, el reverse proxy.
    { provide: API_BASE_URL, useValue: '/api/v1' },
  ],
};
