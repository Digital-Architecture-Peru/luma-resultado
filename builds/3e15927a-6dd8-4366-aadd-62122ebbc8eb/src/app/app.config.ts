import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { environment } from '../environments/environment';
import { routes } from './app.routes';
import { APP_CONFIG } from './core/config/app-config.token';
import { TARJETAS_REPOSITORY } from './features/tarjetas/data/tarjetas.repository';
import { TarjetasMockRepository } from './features/tarjetas/data/tarjetas-mock.repository';

// Punto único de composición. Cuando se defina la integración real,
// añadir un TarjetasHttpRepository y elegirlo aquí según APP_CONFIG.useMock.
export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    { provide: APP_CONFIG, useValue: { useMock: environment.useMock, apiBaseUrl: environment.apiBaseUrl } },
    { provide: TARJETAS_REPOSITORY, useClass: TarjetasMockRepository },
  ],
};
