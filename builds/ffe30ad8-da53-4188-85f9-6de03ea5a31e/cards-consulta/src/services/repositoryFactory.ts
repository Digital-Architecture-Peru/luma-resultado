import type { CardsRepository } from './CardsRepository';
import { MockCardsRepository } from './MockCardsRepository';

export function createRepository(source: string | undefined = import.meta.env.VITE_CARDS_DATA_SOURCE): CardsRepository {
  const kind = source && source.trim() !== '' ? source.trim() : 'mock';
  if (kind === 'mock') {
    return new MockCardsRepository({ delayMs: 300 });
  }
  throw new Error(`Origen de datos no soportado: "${kind}". Integración real sin definir.`);
}
