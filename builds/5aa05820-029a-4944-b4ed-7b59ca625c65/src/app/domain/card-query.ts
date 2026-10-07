import { Card, CardQuery } from './card.model';

export function maskCardNumber(last4: string): string {
  return `•••• •••• •••• ${last4}`;
}

function normalize(value: string): string {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim()
    .toLowerCase();
}

/** Filtra por estado y por texto (titular, marca o últimos 4 dígitos). */
export function filterCards(cards: readonly Card[], query: CardQuery): Card[] {
  const text = normalize(query.text);
  return cards.filter((card) => {
    const matchesStatus = query.status === 'ALL' || card.status === query.status;
    const matchesText =
      text === '' ||
      normalize(card.holder).includes(text) ||
      normalize(card.brand).includes(text) ||
      card.last4.includes(text);
    return matchesStatus && matchesText;
  });
}
