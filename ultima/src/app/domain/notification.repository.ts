import { Observable } from 'rxjs';
import { AccountNotification } from './notification.model';

/** Puerto de lectura de notificaciones; sirve también como token de inyección. */
export abstract class NotificationRepository {
  abstract list(): Observable<AccountNotification[]>;
}
