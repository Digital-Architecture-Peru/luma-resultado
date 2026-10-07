import {
  TransactionRejectedError
} from "./chunk-3BDUIL3P.js";
import {
  validateTransaction
} from "./chunk-RUOCWWY3.js";
import {
  Injectable,
  computed,
  inject,
  setClassMetadata,
  signal,
  ɵɵdefineInjectable,
  ɵɵgetInheritedFactory
} from "./chunk-JSDFT7HK.js";
import {
  __spreadProps,
  __spreadValues
} from "./chunk-RSTWSNOR.js";

// src/app/domain/cards.gateway.ts
var CardsGateway = class {
};

// src/app/infrastructure/in-memory-cards.gateway.ts
var SEED_CARDS = [
  {
    id: "card-1",
    alias: "Visa Platinum",
    maskedNumber: "**** **** **** 1111",
    currency: "PEN",
    creditLimit: 1e4,
    availableCredit: 7500,
    status: "ACTIVE"
  },
  {
    id: "card-2",
    alias: "Mastercard Gold",
    maskedNumber: "**** **** **** 2222",
    currency: "PEN",
    creditLimit: 4e3,
    availableCredit: 4e3,
    status: "ACTIVE"
  },
  {
    id: "card-3",
    alias: "Visa Cl\xE1sica",
    maskedNumber: "**** **** **** 3333",
    currency: "PEN",
    creditLimit: 2e3,
    availableCredit: 500,
    status: "BLOCKED"
  }
];
var InMemoryCardsGateway = class _InMemoryCardsGateway extends CardsGateway {
  cards = SEED_CARDS.map((card) => __spreadValues({}, card));
  transactions = [];
  sequence = 0;
  async listCards() {
    return this.cards.map((card) => __spreadValues({}, card));
  }
  async listTransactions(cardId) {
    return this.transactions.filter((tx) => tx.cardId === cardId).reverse();
  }
  async submit(request) {
    const card = this.cards.find((candidate) => candidate.id === request.cardId);
    const errors = validateTransaction(request, card);
    if (errors.length > 0 || !card) {
      throw new TransactionRejectedError(errors);
    }
    const delta = request.type === "PURCHASE" ? -request.amount : request.amount;
    this.cards = this.cards.map((current) => current.id === card.id ? __spreadProps(__spreadValues({}, current), { availableCredit: round2(current.availableCredit + delta) }) : current);
    this.sequence += 1;
    const transaction = __spreadProps(__spreadValues({}, request), {
      description: request.description.trim(),
      id: `TX-${String(this.sequence).padStart(6, "0")}`,
      createdAt: (/* @__PURE__ */ new Date()).toISOString(),
      status: "APPROVED"
    });
    this.transactions.push(transaction);
    return transaction;
  }
  static \u0275fac = /* @__PURE__ */ (() => {
    let \u0275InMemoryCardsGateway_BaseFactory;
    return function InMemoryCardsGateway_Factory(__ngFactoryType__) {
      return (\u0275InMemoryCardsGateway_BaseFactory || (\u0275InMemoryCardsGateway_BaseFactory = \u0275\u0275getInheritedFactory(_InMemoryCardsGateway)))(__ngFactoryType__ || _InMemoryCardsGateway);
    };
  })();
  static \u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({ token: _InMemoryCardsGateway, factory: _InMemoryCardsGateway.\u0275fac });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(InMemoryCardsGateway, [{
    type: Injectable
  }], null, null);
})();
function round2(value) {
  return Math.round(value * 100) / 100;
}

// src/app/application/transactions.store.ts
var GENERIC_ERROR = "No se pudo procesar la operaci\xF3n. Int\xE9ntalo nuevamente.";
var TransactionsStore = class _TransactionsStore {
  gateway = inject(CardsGateway);
  cards = signal([], ...ngDevMode ? [{ debugName: "cards" }] : []);
  selectedCardId = signal(null, ...ngDevMode ? [{ debugName: "selectedCardId" }] : []);
  history = signal([], ...ngDevMode ? [{ debugName: "history" }] : []);
  busy = signal(false, ...ngDevMode ? [{ debugName: "busy" }] : []);
  error = signal(null, ...ngDevMode ? [{ debugName: "error" }] : []);
  receipt = signal(null, ...ngDevMode ? [{ debugName: "receipt" }] : []);
  selectedCard = computed(() => this.cards().find((card) => card.id === this.selectedCardId()) ?? null, ...ngDevMode ? [{ debugName: "selectedCard" }] : []);
  async load() {
    try {
      const cards = await this.gateway.listCards();
      this.cards.set(cards);
      const first = cards.find((card) => card.status === "ACTIVE") ?? cards[0];
      if (first) {
        await this.select(first.id);
      }
    } catch {
      this.error.set(GENERIC_ERROR);
    }
  }
  async select(cardId) {
    this.selectedCardId.set(cardId);
    this.error.set(null);
    this.receipt.set(null);
    try {
      this.history.set(await this.gateway.listTransactions(cardId));
    } catch {
      this.error.set(GENERIC_ERROR);
    }
  }
  async submit(request) {
    this.busy.set(true);
    this.error.set(null);
    this.receipt.set(null);
    try {
      const transaction = await this.gateway.submit(request);
      this.receipt.set(transaction);
      this.cards.set(await this.gateway.listCards());
      this.history.set(await this.gateway.listTransactions(request.cardId));
    } catch (failure) {
      this.error.set(failure instanceof TransactionRejectedError ? failure.message : GENERIC_ERROR);
    } finally {
      this.busy.set(false);
    }
  }
  static \u0275fac = function TransactionsStore_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _TransactionsStore)();
  };
  static \u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({ token: _TransactionsStore, factory: _TransactionsStore.\u0275fac, providedIn: "root" });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(TransactionsStore, [{
    type: Injectable,
    args: [{ providedIn: "root" }]
  }], null, null);
})();

export {
  CardsGateway,
  InMemoryCardsGateway,
  GENERIC_ERROR,
  TransactionsStore
};
//# sourceMappingURL=chunk-CERFQUXA.js.map
