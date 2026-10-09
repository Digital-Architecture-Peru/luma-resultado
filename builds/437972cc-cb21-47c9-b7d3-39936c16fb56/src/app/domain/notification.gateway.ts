import { CardNotification } from './card-notification.model';

/** Puerto de lectura de notificaciones. La integración real aún no está definida. */
export abstract class NotificationGateway {
  abstract list(): Promise<CardNotification[]>;
}
