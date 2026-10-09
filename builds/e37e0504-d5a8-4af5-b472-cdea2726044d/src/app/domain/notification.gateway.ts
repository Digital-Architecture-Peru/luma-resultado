import { Observable } from 'rxjs';
import { PaymentNotification } from './notification.model';

/** Puerto de integración (aún sin definir): la UI depende de esta abstracción, no de HTTP. */
export abstract class NotificationGateway {
  abstract list(): Observable<PaymentNotification[]>;
}
