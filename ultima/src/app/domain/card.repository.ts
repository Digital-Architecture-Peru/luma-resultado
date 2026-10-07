import { Observable } from 'rxjs';
import { Card } from './card.model';

/**
 * Puerto de consulta de tarjetas. La integración real (sin definir) se
 * implementa como adaptador de esta clase y se enlaza en app.config.ts.
 */
export abstract class CardRepository {
  abstract list(): Observable<Card[]>;
}
