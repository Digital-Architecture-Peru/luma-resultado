import type { Card } from '../domain/card';
import { cardsFixture } from '../mocks/cards.fixture';
import type { CardsRepository } from './CardsRepository';

export interface MockOptions {
  delayMs?: number;
  fail?: boolean;
  data?: Card[];
}

export class MockCardsRepository implements CardsRepository {
  private readonly delayMs: number;
  private readonly fail: boolean;
  private readonly data: Card[];

  constructor(options: MockOptions = {}) {
    this.delayMs = options.delayMs ?? 0;
    this.fail = options.fail ?? false;
    this.data = options.data ?? cardsFixture;
  }

  private async simulate(): Promise<void> {
    if (this.delayMs > 0) {
      await new Promise((resolve) => setTimeout(resolve, this.delayMs));
    }
    if (this.fail) {
      throw new Error('Servicio de tarjetas no disponible');
    }
  }

  async list(): Promise<Card[]> {
    await this.simulate();
    return this.data.map((c) => ({ ...c }));
  }

  async getById(id: string): Promise<Card | null> {
    await this.simulate();
    const found = this.data.find((c) => c.id === id);
    return found ? { ...found } : null;
  }
}
