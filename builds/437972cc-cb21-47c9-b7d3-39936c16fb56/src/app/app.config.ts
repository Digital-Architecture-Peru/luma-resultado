import { ApplicationConfig } from '@angular/core';
import { NotificationGateway } from './domain/notification.gateway';
import { MockNotificationGateway } from './adapters/mock-notification.gateway';

/** Único punto de composición: aquí se elige el adaptador del puerto. */
export const appConfig: ApplicationConfig = {
  providers: [{ provide: NotificationGateway, useClass: MockNotificationGateway }],
};
