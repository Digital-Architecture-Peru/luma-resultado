import { Observable } from 'rxjs';
import { Card } from '../domain/card.model';

/** Puerto de datos (AD3). Clase abstracta usada como token de DI. */
export abstract class CardsGateway {
  abstract list(): Observable<Card[]>;
  /** Emite la tarjeta o `null` si no existe. */
  abstract getById(id: string): Observable<Card | null>;
}
