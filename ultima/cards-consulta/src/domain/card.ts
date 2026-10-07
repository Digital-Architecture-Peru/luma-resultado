export type CardStatus = 'ACTIVE' | 'BLOCKED' | 'EXPIRED';

/** Modelo de lectura. Nunca contiene el PAN completo: solo los últimos 4 dígitos. */
export interface Card {
  id: string;
  alias: string;
  brand: string;
  last4: string;
  holder: string;
  status: CardStatus;
  currency: string; // ISO 4217
  creditLimit: number;
  availableBalance: number;
  expiresAt: string; // MM/YY
}
