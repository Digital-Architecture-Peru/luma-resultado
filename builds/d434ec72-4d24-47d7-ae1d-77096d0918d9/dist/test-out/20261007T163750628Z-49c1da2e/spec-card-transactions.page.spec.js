import {
  CardsGateway,
  InMemoryCardsGateway,
  TransactionsStore
} from "./chunk-CERFQUXA.js";
import {
  TransactionForm
} from "./chunk-3KST47PQ.js";
import {
  TRANSACTION_TYPE_LABELS
} from "./chunk-3BDUIL3P.js";
import "./chunk-JVHS6TT5.js";
import "./chunk-RUOCWWY3.js";
import {
  CurrencyPipe,
  DatePipe
} from "./chunk-ZRW7ZMDC.js";
import {
  ChangeDetectionStrategy,
  Component,
  Input,
  TestBed,
  inject,
  input,
  provideZonelessChangeDetection,
  setClassMetadata,
  ɵsetClassDebugInfo,
  ɵɵadvance,
  ɵɵclassProp,
  ɵɵconditional,
  ɵɵconditionalCreate,
  ɵɵdefineComponent,
  ɵɵdomElementEnd,
  ɵɵdomElementStart,
  ɵɵelement,
  ɵɵelementEnd,
  ɵɵelementStart,
  ɵɵlistener,
  ɵɵnextContext,
  ɵɵpipe,
  ɵɵpipeBind2,
  ɵɵpipeBind4,
  ɵɵproperty,
  ɵɵrepeater,
  ɵɵrepeaterCreate,
  ɵɵtext,
  ɵɵtextInterpolate,
  ɵɵtextInterpolate1,
  ɵɵtextInterpolate2
} from "./chunk-JSDFT7HK.js";
import "./chunk-RSTWSNOR.js";

// src/app/pages/card-transactions.page.spec.ts
import { beforeEach, describe, expect, it } from "vitest";

// src/app/atoms/status-badge.ts
var StatusBadge = class _StatusBadge {
  text = input.required(...ngDevMode ? [{ debugName: "text" }] : []);
  tone = input("success", ...ngDevMode ? [{ debugName: "tone" }] : []);
  static \u0275fac = function StatusBadge_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _StatusBadge)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _StatusBadge, selectors: [["app-status-badge"]], inputs: { text: [1, "text"], tone: [1, "tone"] }, decls: 2, vars: 3, consts: [[1, "badge"]], template: function StatusBadge_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275domElementStart(0, "span", 0);
      \u0275\u0275text(1);
      \u0275\u0275domElementEnd();
    }
    if (rf & 2) {
      \u0275\u0275classProp("badge-danger", ctx.tone() === "danger");
      \u0275\u0275advance();
      \u0275\u0275textInterpolate(ctx.text());
    }
  }, encapsulation: 2, changeDetection: 0 });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(StatusBadge, [{
    type: Component,
    args: [{
      selector: "app-status-badge",
      changeDetection: ChangeDetectionStrategy.OnPush,
      template: `<span class="badge" [class.badge-danger]="tone() === 'danger'">{{ text() }}</span>`
    }]
  }], null, { text: [{ type: Input, args: [{ isSignal: true, alias: "text", required: true }] }], tone: [{ type: Input, args: [{ isSignal: true, alias: "tone", required: false }] }] });
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(StatusBadge, { className: "StatusBadge", filePath: "src/app/atoms/status-badge.ts", lineNumber: 8 });
})();

// src/app/molecules/card-summary.ts
var CardSummary = class _CardSummary {
  card = input.required(...ngDevMode ? [{ debugName: "card" }] : []);
  static \u0275fac = function CardSummary_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _CardSummary)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _CardSummary, selectors: [["app-card-summary"]], inputs: { card: [1, "card"] }, decls: 14, vars: 16, consts: [["aria-label", "Resumen de la tarjeta", 1, "card-summary"], [1, "mono"], [3, "text", "tone"]], template: function CardSummary_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275elementStart(0, "article", 0)(1, "h3");
      \u0275\u0275text(2);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(3, "p", 1);
      \u0275\u0275text(4);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(5, "p");
      \u0275\u0275text(6, " Cr\xE9dito disponible: ");
      \u0275\u0275elementStart(7, "strong");
      \u0275\u0275text(8);
      \u0275\u0275pipe(9, "currency");
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(10, "p");
      \u0275\u0275text(11);
      \u0275\u0275pipe(12, "currency");
      \u0275\u0275elementEnd();
      \u0275\u0275element(13, "app-status-badge", 2);
      \u0275\u0275elementEnd();
    }
    if (rf & 2) {
      \u0275\u0275advance(2);
      \u0275\u0275textInterpolate(ctx.card().alias);
      \u0275\u0275advance(2);
      \u0275\u0275textInterpolate(ctx.card().maskedNumber);
      \u0275\u0275advance(4);
      \u0275\u0275textInterpolate(\u0275\u0275pipeBind4(9, 6, ctx.card().availableCredit, ctx.card().currency, "symbol", "1.2-2"));
      \u0275\u0275advance(3);
      \u0275\u0275textInterpolate1("L\xEDnea: ", \u0275\u0275pipeBind4(12, 11, ctx.card().creditLimit, ctx.card().currency, "symbol", "1.2-2"));
      \u0275\u0275advance(2);
      \u0275\u0275property("text", ctx.card().status === "ACTIVE" ? "Activa" : "Bloqueada")("tone", ctx.card().status === "ACTIVE" ? "success" : "danger");
    }
  }, dependencies: [StatusBadge, CurrencyPipe], encapsulation: 2, changeDetection: 0 });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(CardSummary, [{
    type: Component,
    args: [{
      selector: "app-card-summary",
      imports: [CurrencyPipe, StatusBadge],
      changeDetection: ChangeDetectionStrategy.OnPush,
      template: `
    <article class="card-summary" aria-label="Resumen de la tarjeta">
      <h3>{{ card().alias }}</h3>
      <p class="mono">{{ card().maskedNumber }}</p>
      <p>
        Cr\xE9dito disponible:
        <strong>{{ card().availableCredit | currency: card().currency : 'symbol' : '1.2-2' }}</strong>
      </p>
      <p>L\xEDnea: {{ card().creditLimit | currency: card().currency : 'symbol' : '1.2-2' }}</p>
      <app-status-badge
        [text]="card().status === 'ACTIVE' ? 'Activa' : 'Bloqueada'"
        [tone]="card().status === 'ACTIVE' ? 'success' : 'danger'"
      />
    </article>
  `
    }]
  }], null, { card: [{ type: Input, args: [{ isSignal: true, alias: "card", required: true }] }] });
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(CardSummary, { className: "CardSummary", filePath: "src/app/molecules/card-summary.ts", lineNumber: 26 });
})();

// src/app/organisms/transaction-history.ts
var _forTrack0 = ($index, $item) => $item.id;
function TransactionHistory_Conditional_3_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275domElementStart(0, "p", 2);
    \u0275\u0275text(1, "A\xFAn no hay movimientos para esta tarjeta.");
    \u0275\u0275domElementEnd();
  }
}
function TransactionHistory_Conditional_4_For_15_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275domElementStart(0, "tr")(1, "td");
    \u0275\u0275text(2);
    \u0275\u0275domElementEnd();
    \u0275\u0275domElementStart(3, "td");
    \u0275\u0275text(4);
    \u0275\u0275pipe(5, "date");
    \u0275\u0275domElementEnd();
    \u0275\u0275domElementStart(6, "td");
    \u0275\u0275text(7);
    \u0275\u0275domElementEnd();
    \u0275\u0275domElementStart(8, "td");
    \u0275\u0275text(9);
    \u0275\u0275domElementEnd();
    \u0275\u0275domElementStart(10, "td", 5);
    \u0275\u0275text(11);
    \u0275\u0275pipe(12, "currency");
    \u0275\u0275domElementEnd()();
  }
  if (rf & 2) {
    const tx_r1 = ctx.$implicit;
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(tx_r1.id);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind2(5, 5, tx_r1.createdAt, "short"));
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(ctx_r1.labels[tx_r1.type]);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(tx_r1.description);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind4(12, 8, tx_r1.amount, ctx_r1.currency(), "symbol", "1.2-2"));
  }
}
function TransactionHistory_Conditional_4_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275domElementStart(0, "table")(1, "thead")(2, "tr")(3, "th", 3);
    \u0275\u0275text(4, "Referencia");
    \u0275\u0275domElementEnd();
    \u0275\u0275domElementStart(5, "th", 3);
    \u0275\u0275text(6, "Fecha");
    \u0275\u0275domElementEnd();
    \u0275\u0275domElementStart(7, "th", 3);
    \u0275\u0275text(8, "Operaci\xF3n");
    \u0275\u0275domElementEnd();
    \u0275\u0275domElementStart(9, "th", 3);
    \u0275\u0275text(10, "Descripci\xF3n");
    \u0275\u0275domElementEnd();
    \u0275\u0275domElementStart(11, "th", 4);
    \u0275\u0275text(12, "Monto");
    \u0275\u0275domElementEnd()()();
    \u0275\u0275domElementStart(13, "tbody");
    \u0275\u0275repeaterCreate(14, TransactionHistory_Conditional_4_For_15_Template, 13, 13, "tr", null, _forTrack0);
    \u0275\u0275domElementEnd()();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275advance(14);
    \u0275\u0275repeater(ctx_r1.transactions());
  }
}
var TransactionHistory = class _TransactionHistory {
  transactions = input.required(...ngDevMode ? [{ debugName: "transactions" }] : []);
  currency = input("PEN", ...ngDevMode ? [{ debugName: "currency" }] : []);
  labels = TRANSACTION_TYPE_LABELS;
  static \u0275fac = function TransactionHistory_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _TransactionHistory)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _TransactionHistory, selectors: [["app-transaction-history"]], inputs: { transactions: [1, "transactions"], currency: [1, "currency"] }, decls: 5, vars: 1, consts: [["aria-labelledby", "history-title", 1, "panel"], ["id", "history-title"], [1, "empty"], ["scope", "col"], ["scope", "col", 1, "num"], [1, "num"]], template: function TransactionHistory_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275domElementStart(0, "section", 0)(1, "h2", 1);
      \u0275\u0275text(2, "Movimientos de la sesi\xF3n");
      \u0275\u0275domElementEnd();
      \u0275\u0275conditionalCreate(3, TransactionHistory_Conditional_3_Template, 2, 0, "p", 2)(4, TransactionHistory_Conditional_4_Template, 16, 0, "table");
      \u0275\u0275domElementEnd();
    }
    if (rf & 2) {
      \u0275\u0275advance(3);
      \u0275\u0275conditional(ctx.transactions().length === 0 ? 3 : 4);
    }
  }, dependencies: [CurrencyPipe, DatePipe], encapsulation: 2, changeDetection: 0 });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(TransactionHistory, [{
    type: Component,
    args: [{
      selector: "app-transaction-history",
      imports: [CurrencyPipe, DatePipe],
      changeDetection: ChangeDetectionStrategy.OnPush,
      template: `
    <section class="panel" aria-labelledby="history-title">
      <h2 id="history-title">Movimientos de la sesi\xF3n</h2>
      @if (transactions().length === 0) {
        <p class="empty">A\xFAn no hay movimientos para esta tarjeta.</p>
      } @else {
        <table>
          <thead>
            <tr>
              <th scope="col">Referencia</th>
              <th scope="col">Fecha</th>
              <th scope="col">Operaci\xF3n</th>
              <th scope="col">Descripci\xF3n</th>
              <th scope="col" class="num">Monto</th>
            </tr>
          </thead>
          <tbody>
            @for (tx of transactions(); track tx.id) {
              <tr>
                <td>{{ tx.id }}</td>
                <td>{{ tx.createdAt | date: 'short' }}</td>
                <td>{{ labels[tx.type] }}</td>
                <td>{{ tx.description }}</td>
                <td class="num">{{ tx.amount | currency: currency() : 'symbol' : '1.2-2' }}</td>
              </tr>
            }
          </tbody>
        </table>
      }
    </section>
  `
    }]
  }], null, { transactions: [{ type: Input, args: [{ isSignal: true, alias: "transactions", required: true }] }], currency: [{ type: Input, args: [{ isSignal: true, alias: "currency", required: false }] }] });
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(TransactionHistory, { className: "TransactionHistory", filePath: "src/app/organisms/transaction-history.ts", lineNumber: 41 });
})();

// src/app/pages/card-transactions.page.ts
function CardTransactionsPage_Conditional_4_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p", 2);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const receipt_r1 = ctx;
    \u0275\u0275advance();
    \u0275\u0275textInterpolate2(" Transacci\xF3n aprobada. Referencia ", receipt_r1.id, " por ", receipt_r1.amount, ". ");
  }
}
function CardTransactionsPage_Conditional_5_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p", 3);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(ctx);
  }
}
function CardTransactionsPage_Conditional_8_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "app-card-summary", 5);
  }
  if (rf & 2) {
    \u0275\u0275property("card", ctx);
  }
}
var CardTransactionsPage = class _CardTransactionsPage {
  store = inject(TransactionsStore);
  ngOnInit() {
    void this.store.load();
  }
  onSubmitted(request) {
    void this.store.submit(request);
  }
  static \u0275fac = function CardTransactionsPage_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _CardTransactionsPage)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _CardTransactionsPage, selectors: [["app-card-transactions-page"]], decls: 11, vars: 8, consts: [[1, "page"], ["role", "status", "aria-live", "polite"], [1, "notice-ok"], ["role", "alert", 1, "notice-error"], [1, "layout"], [3, "card"], [3, "cardChange", "submitted", "cards", "selectedCardId", "busy"], [3, "transactions", "currency"]], template: function CardTransactionsPage_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275elementStart(0, "main", 0)(1, "h1");
      \u0275\u0275text(2, "Tarjetas \xB7 Transacciones");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(3, "div", 1);
      \u0275\u0275conditionalCreate(4, CardTransactionsPage_Conditional_4_Template, 2, 2, "p", 2);
      \u0275\u0275elementEnd();
      \u0275\u0275conditionalCreate(5, CardTransactionsPage_Conditional_5_Template, 2, 1, "p", 3);
      \u0275\u0275elementStart(6, "div", 4)(7, "div");
      \u0275\u0275conditionalCreate(8, CardTransactionsPage_Conditional_8_Template, 1, 1, "app-card-summary", 5);
      \u0275\u0275elementStart(9, "app-transaction-form", 6);
      \u0275\u0275listener("cardChange", function CardTransactionsPage_Template_app_transaction_form_cardChange_9_listener($event) {
        return ctx.store.select($event);
      })("submitted", function CardTransactionsPage_Template_app_transaction_form_submitted_9_listener($event) {
        return ctx.onSubmitted($event);
      });
      \u0275\u0275elementEnd()();
      \u0275\u0275element(10, "app-transaction-history", 7);
      \u0275\u0275elementEnd()();
    }
    if (rf & 2) {
      let tmp_0_0;
      let tmp_1_0;
      let tmp_2_0;
      let tmp_7_0;
      \u0275\u0275advance(4);
      \u0275\u0275conditional((tmp_0_0 = ctx.store.receipt()) ? 4 : -1, tmp_0_0);
      \u0275\u0275advance();
      \u0275\u0275conditional((tmp_1_0 = ctx.store.error()) ? 5 : -1, tmp_1_0);
      \u0275\u0275advance(3);
      \u0275\u0275conditional((tmp_2_0 = ctx.store.selectedCard()) ? 8 : -1, tmp_2_0);
      \u0275\u0275advance();
      \u0275\u0275property("cards", ctx.store.cards())("selectedCardId", ctx.store.selectedCardId())("busy", ctx.store.busy());
      \u0275\u0275advance();
      \u0275\u0275property("transactions", ctx.store.history())("currency", ((tmp_7_0 = ctx.store.selectedCard()) == null ? null : tmp_7_0.currency) ?? "PEN");
    }
  }, dependencies: [CardSummary, TransactionForm, TransactionHistory], encapsulation: 2, changeDetection: 0 });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(CardTransactionsPage, [{
    type: Component,
    args: [{
      selector: "app-card-transactions-page",
      imports: [CardSummary, TransactionForm, TransactionHistory],
      changeDetection: ChangeDetectionStrategy.OnPush,
      template: `
    <main class="page">
      <h1>Tarjetas \xB7 Transacciones</h1>

      <div role="status" aria-live="polite">
        @if (store.receipt(); as receipt) {
          <p class="notice-ok">
            Transacci\xF3n aprobada. Referencia {{ receipt.id }} por {{ receipt.amount }}.
          </p>
        }
      </div>
      @if (store.error(); as message) {
        <p class="notice-error" role="alert">{{ message }}</p>
      }

      <div class="layout">
        <div>
          @if (store.selectedCard(); as card) {
            <app-card-summary [card]="card" />
          }
          <app-transaction-form
            [cards]="store.cards()"
            [selectedCardId]="store.selectedCardId()"
            [busy]="store.busy()"
            (cardChange)="store.select($event)"
            (submitted)="onSubmitted($event)"
          />
        </div>
        <app-transaction-history
          [transactions]="store.history()"
          [currency]="store.selectedCard()?.currency ?? 'PEN'"
        />
      </div>
    </main>
  `
    }]
  }], null, null);
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(CardTransactionsPage, { className: "CardTransactionsPage", filePath: "src/app/pages/card-transactions.page.ts", lineNumber: 48 });
})();

// src/app/pages/card-transactions.page.spec.ts
describe("CardTransactionsPage", () => {
  let fixture;
  let root;
  async function settle() {
    await fixture.whenStable();
    fixture.detectChanges();
    await fixture.whenStable();
  }
  async function fill(id, value) {
    const input2 = root.querySelector(`#${id}`);
    input2.value = value;
    input2.dispatchEvent(new Event("input"));
    await fixture.whenStable();
  }
  beforeEach(async () => {
    TestBed.configureTestingModule({
      imports: [CardTransactionsPage],
      providers: [
        provideZonelessChangeDetection(),
        { provide: CardsGateway, useClass: InMemoryCardsGateway }
      ]
    });
    fixture = TestBed.createComponent(CardTransactionsPage);
    root = fixture.nativeElement;
    await settle();
  });
  it("given the page loads then shows the first card and an empty history", () => {
    expect(root.querySelector("app-card-summary")?.textContent).toContain("Visa Platinum");
    expect(root.querySelector(".empty")).not.toBeNull();
  });
  it("given a valid transaction then announces approval in role=status and lists the movement", async () => {
    await fill("amount", "120");
    await fill("description", "Supermercado");
    root.querySelector("form").dispatchEvent(new Event("submit"));
    await settle();
    await settle();
    expect(root.querySelector('[role="status"]')?.textContent).toContain("Transacci\xF3n aprobada");
    expect(root.querySelector("tbody tr")?.textContent).toContain("Supermercado");
  });
});
//# sourceMappingURL=spec-card-transactions.page.spec.js.map
