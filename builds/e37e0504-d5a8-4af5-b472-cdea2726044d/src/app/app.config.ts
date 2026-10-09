import { ApplicationConfig } from '@angular/core';
import { NotificationGateway } from './domain/notification.gateway';
import { MockNotificationGateway } from './adapters/mock-notification.gateway';

/** Único punto de composición: aquí se cambia el adaptador mock por uno HTTP cuando se defina la integración. */
export const appConfig: ApplicationConfig = {
  providers: [{ provide: NotificationGateway, useClass: MockNotificationGateway }]
};
