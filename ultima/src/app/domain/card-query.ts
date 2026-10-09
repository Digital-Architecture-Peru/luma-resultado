import { Card, CardQuery } from './card.model';

export const EMPTY_QUERY: CardQuery = { text: '', status: 'all' };

function normalize(value: string): string {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim();
}

function matchesText(card: Card, text: string): boolean {
  if (text === '') {
    return true;
  }
  const haystack = normalize(`${card.holder} ${card.brand} ${card.last4}`);
  return haystack.includes(text);
}

export function filterCards(cards: readonly Card[], query: CardQuery): Card[] {
  const text = normalize(query.text);
  return cards.filter(
    (card) => (query.status === 'all' || card.status === query.status) && matchesText(card, text),
  );
}
