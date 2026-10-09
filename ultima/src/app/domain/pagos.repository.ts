import { Observable } from 'rxjs';
import { Pago } from './pago.model';

/** Puerto de consulta de pagos (integración aún sin definir). */
export abstract class PagosRepository {
  abstract consultar(): Observable<readonly Pago[]>;
}
