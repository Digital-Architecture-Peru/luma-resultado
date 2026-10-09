import { Card } from './card.model';

/** Puerto de lectura de tarjetas. La integración real aún no está definida. */
export interface CardRepository {
  list(): Promise<Card[]>;
}
