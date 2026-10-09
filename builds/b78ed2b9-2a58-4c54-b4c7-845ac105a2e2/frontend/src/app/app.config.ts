import { ApplicationConfig } from '@angular/core';
import { provideHttpClient } from '@angular/common/http';
import { environment } from '../environments/environment';
import { API_BASE_URL } from './core/cards-api.service';

export const appConfig: ApplicationConfig = {
  providers: [provideHttpClient(), { provide: API_BASE_URL, useValue: environment.apiBaseUrl }],
};
