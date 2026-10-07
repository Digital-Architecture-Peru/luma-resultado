import type { Card } from '../domain/card';

/** Puerto de lectura. La integración real (H4) se implementará aquí sin tocar la UI. */
export interface CardsRepository {
  list(): Promise<Card[]>;
  getById(id: string): Promise<Card | null>;
}
