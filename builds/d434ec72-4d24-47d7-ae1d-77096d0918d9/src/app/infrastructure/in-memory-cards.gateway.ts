import { Injectable } from '@angular/core';
import { Card, Transaction, TransactionRejectedError, TransactionRequest } from '../domain/card.model';
import { CardsGateway } from '../domain/cards.gateway';
import { validateTransaction } from '../domain/transaction.validation';

const SEED_CARDS: readonly Card[] = [
  {
    id: 'card-1',
    alias: 'Visa Platinum',
    maskedNumber: '**** **** **** 1111',
    currency: 'PEN',
    creditLimit: 10000,
    availableCredit: 7500,
    status: 'ACTIVE',
  },
  {
    id: 'card-2',
    alias: 'Mastercard Gold',
    maskedNumber: '**** **** **** 2222',
    currency: 'PEN',
    creditLimit: 4000,
    availableCredit: 4000,
    status: 'ACTIVE',
  },
  {
    id: 'card-3',
    alias: 'Visa Clásica',
    maskedNumber: '**** **** **** 3333',
    currency: 'PEN',
    creditLimit: 2000,
    availableCredit: 500,
    status: 'BLOCKED',
  },
];

/** Adaptador con datos ficticios en memoria (se pierden al recargar). */
@Injectable()
export class InMemoryCardsGateway extends CardsGateway {
  private cards: Card[] = SEED_CARDS.map((card) => ({ ...card }));
  private transactions: Transaction[] = [];
  private sequence = 0;

  override async listCards(): Promise<Card[]> {
    return this.cards.map((card) => ({ ...card }));
  }

  override async listTransactions(cardId: string): Promise<Transaction[]> {
    return this.transactions.filter((tx) => tx.cardId === cardId).reverse();
  }

  override async submit(request: TransactionRequest): Promise<Transaction> {
    const card = this.cards.find((candidate) => candidate.id === request.cardId);
    const errors = validateTransaction(request, card);
    if (errors.length > 0 || !card) {
      throw new TransactionRejectedError(errors);
    }
    const delta = request.type === 'PURCHASE' ? -request.amount : request.amount;
    this.cards = this.cards.map((current) =>
      current.id === card.id
        ? { ...current, availableCredit: round2(current.availableCredit + delta) }
        : current,
    );
    this.sequence += 1;
    const transaction: Transaction = {
      ...request,
      description: request.description.trim(),
      id: `TX-${String(this.sequence).padStart(6, '0')}`,
      createdAt: new Date().toISOString(),
      status: 'APPROVED',
    };
    this.transactions.push(transaction);
    return transaction;
  }
}

function round2(value: number): number {
  return Math.round(value * 100) / 100;
}
