import { ApplicationConfig } from '@angular/core';
import { NotificationRepository } from './domain/notification.repository';
import { InMemoryNotificationRepository } from './adapters/in-memory-notification.repository';

// Único punto de composición: aquí se enlaza el puerto con su adaptador.
// La integración real (API de notificaciones) está sin definir; se sustituye este adaptador.
export const appConfig: ApplicationConfig = {
  providers: [
    { provide: NotificationRepository, useClass: InMemoryNotificationRepository },
  ],
};
