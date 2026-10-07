export type CardType = 'credito' | 'debito';
export type CardStatus = 'activa' | 'bloqueada' | 'vencida';
export type StatusFilter = CardStatus | 'todas';

export interface Card {
  id: string;
  alias: string;
  holder: string;
  brand: string;
  type: CardType;
  /** Solo los últimos 4 dígitos; nunca el número completo. */
  last4: string;
  status: CardStatus;
  expiry: string;
  currency: string;
  creditLimit: number | null;
  availableBalance: number;
}

export interface CardFilterCriteria {
  query: string;
  status: StatusFilter;
}

export const STATUS_LABELS: Record<CardStatus, string> = {
  activa: 'Activa',
  bloqueada: 'Bloqueada',
  vencida: 'Vencida',
};

export const TYPE_LABELS: Record<CardType, string> = {
  credito: 'Crédito',
  debito: 'Débito',
};

export function maskCardNumber(last4: string): string {
  return `•••• •••• •••• ${last4}`;
}

export function filterCards(cards: readonly Card[], criteria: CardFilterCriteria): Card[] {
  const query = criteria.query.trim().toLowerCase();
  return cards.filter((card) => {
    const matchesStatus = criteria.status === 'todas' || card.status === criteria.status;
    const matchesQuery =
      query === '' ||
      card.alias.toLowerCase().includes(query) ||
      card.brand.toLowerCase().includes(query) ||
      card.last4.includes(query);
    return matchesStatus && matchesQuery;
  });
}

export function formatMoney(amount: number, currency: string): string {
  return new Intl.NumberFormat('es-PE', { style: 'currency', currency }).format(amount);
}
