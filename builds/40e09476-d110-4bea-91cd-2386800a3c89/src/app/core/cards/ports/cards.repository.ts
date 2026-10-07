import { Observable } from 'rxjs';
import { Card } from '../models/card.model';
import { Movement } from '../models/movement.model';

/** Puerto de lectura de tarjetas. La integración real está sin definir. */
export abstract class CardsRepository {
  abstract list(): Observable<Card[]>;
  abstract getById(id: string): Observable<Card | undefined>;
  abstract movements(cardId: string): Observable<Movement[]>;
}
