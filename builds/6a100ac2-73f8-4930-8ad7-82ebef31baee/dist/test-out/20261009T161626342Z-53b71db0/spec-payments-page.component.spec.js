import {
  EMPTY_FILTER,
  STATUS_LABELS,
  StatusBadgeComponent
} from "./chunk-V2W5D2RK.js";
import {
  filterPayments,
  formatAmount,
  sortByDateDesc,
  totalCompletedByCurrency
} from "./chunk-BK2EBSJR.js";
import {
  ChangeDetectionStrategy,
  Component,
  Injectable,
  Input,
  Output,
  TestBed,
  computed,
  inject,
  input,
  output,
  provideZonelessChangeDetection,
  setClassMetadata,
  signal,
  ɵsetClassDebugInfo,
  ɵɵadvance,
  ɵɵconditional,
  ɵɵconditionalCreate,
  ɵɵdefineComponent,
  ɵɵdefineInjectable,
  ɵɵdomElementEnd,
  ɵɵdomElementStart,
  ɵɵdomListener,
  ɵɵdomProperty,
  ɵɵelement,
  ɵɵelementEnd,
  ɵɵelementStart,
  ɵɵgetCurrentView,
  ɵɵgetInheritedFactory,
  ɵɵlistener,
  ɵɵnextContext,
  ɵɵproperty,
  ɵɵrepeater,
  ɵɵrepeaterCreate,
  ɵɵresetView,
  ɵɵrestoreView,
  ɵɵtext,
  ɵɵtextInterpolate,
  ɵɵtextInterpolate1,
  ɵɵtextInterpolate2
} from "./chunk-W5AVGSS5.js";
import {
  __spreadProps,
  __spreadValues
} from "./chunk-RSTWSNOR.js";

// src/app/pages/payments-page.component.spec.ts
import { beforeEach, describe, expect, it } from "vitest";

// src/app/domain/payment.repository.ts
var PaymentRepository = class {
};

// src/app/infrastructure/mock-payment.repository.ts
var SAMPLE_PAYMENTS = [
  { id: "PAG-1001", date: "2026-10-08", beneficiary: "Empresa El\xE9ctrica Demo", concept: "Servicio de luz septiembre", amount: 84.5, currency: "USD", status: "COMPLETED" },
  { id: "PAG-1002", date: "2026-10-07", beneficiary: "Agua Potable Demo", concept: "Servicio de agua", amount: 23.1, currency: "USD", status: "COMPLETED" },
  { id: "PAG-1003", date: "2026-10-05", beneficiary: "Colegio Ejemplo", concept: "Pensi\xF3n octubre", amount: 310, currency: "USD", status: "PENDING" },
  { id: "PAG-1004", date: "2026-10-02", beneficiary: "Telecom Ficticia", concept: "Plan m\xF3vil", amount: 35.9, currency: "USD", status: "REJECTED" },
  { id: "PAG-1005", date: "2026-09-28", beneficiary: "Seguros Demo", concept: "Prima mensual", amount: 120, currency: "USD", status: "COMPLETED" },
  { id: "PAG-1006", date: "2026-09-21", beneficiary: "Tarjeta Ejemplo", concept: "Pago de tarjeta", amount: 450.75, currency: "USD", status: "PENDING" }
];
var MockPaymentRepository = class _MockPaymentRepository extends PaymentRepository {
  list() {
    return Promise.resolve([...SAMPLE_PAYMENTS]);
  }
  static \u0275fac = /* @__PURE__ */ (() => {
    let \u0275MockPaymentRepository_BaseFactory;
    return function MockPaymentRepository_Factory(__ngFactoryType__) {
      return (\u0275MockPaymentRepository_BaseFactory || (\u0275MockPaymentRepository_BaseFactory = \u0275\u0275getInheritedFactory(_MockPaymentRepository)))(__ngFactoryType__ || _MockPaymentRepository);
    };
  })();
  static \u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({ token: _MockPaymentRepository, factory: _MockPaymentRepository.\u0275fac });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(MockPaymentRepository, [{
    type: Injectable
  }], null, null);
})();

// src/app/molecules/payment-filter.component.ts
var _forTrack0 = ($index, $item) => $item.value;
function PaymentFilterComponent_For_12_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275domElementStart(0, "option", 7);
    \u0275\u0275text(1);
    \u0275\u0275domElementEnd();
  }
  if (rf & 2) {
    const option_r1 = ctx.$implicit;
    \u0275\u0275domProperty("value", option_r1.value);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(option_r1.label);
  }
}
var PaymentFilterComponent = class _PaymentFilterComponent {
  filter = input.required(...ngDevMode ? [{ debugName: "filter" }] : []);
  filterChange = output();
  options = Object.keys(STATUS_LABELS).map((value) => ({ value, label: STATUS_LABELS[value] }));
  onText(event) {
    const text = event.target.value;
    this.filterChange.emit(__spreadProps(__spreadValues({}, this.filter()), { text }));
  }
  onStatus(event) {
    const status = event.target.value;
    this.filterChange.emit(__spreadProps(__spreadValues({}, this.filter()), { status }));
  }
  static \u0275fac = function PaymentFilterComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _PaymentFilterComponent)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _PaymentFilterComponent, selectors: [["app-payment-filter"]], inputs: { filter: [1, "filter"] }, outputs: { filterChange: "filterChange" }, decls: 15, vars: 2, consts: [[1, "filter", 3, "submit"], [1, "field"], ["for", "search"], ["id", "search", "type", "search", "placeholder", "Beneficiario, concepto o referencia", 3, "input", "value"], ["for", "status"], ["id", "status", 3, "change", "value"], ["value", "ALL"], [3, "value"], ["type", "button", 1, "btn-secondary", 3, "click"]], template: function PaymentFilterComponent_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275domElementStart(0, "form", 0);
      \u0275\u0275domListener("submit", function PaymentFilterComponent_Template_form_submit_0_listener($event) {
        return $event.preventDefault();
      });
      \u0275\u0275domElementStart(1, "div", 1)(2, "label", 2);
      \u0275\u0275text(3, "Buscar");
      \u0275\u0275domElementEnd();
      \u0275\u0275domElementStart(4, "input", 3);
      \u0275\u0275domListener("input", function PaymentFilterComponent_Template_input_input_4_listener($event) {
        return ctx.onText($event);
      });
      \u0275\u0275domElementEnd()();
      \u0275\u0275domElementStart(5, "div", 1)(6, "label", 4);
      \u0275\u0275text(7, "Estado");
      \u0275\u0275domElementEnd();
      \u0275\u0275domElementStart(8, "select", 5);
      \u0275\u0275domListener("change", function PaymentFilterComponent_Template_select_change_8_listener($event) {
        return ctx.onStatus($event);
      });
      \u0275\u0275domElementStart(9, "option", 6);
      \u0275\u0275text(10, "Todos");
      \u0275\u0275domElementEnd();
      \u0275\u0275repeaterCreate(11, PaymentFilterComponent_For_12_Template, 2, 2, "option", 7, _forTrack0);
      \u0275\u0275domElementEnd()();
      \u0275\u0275domElementStart(13, "button", 8);
      \u0275\u0275domListener("click", function PaymentFilterComponent_Template_button_click_13_listener() {
        return ctx.filterChange.emit({ text: "", status: "ALL" });
      });
      \u0275\u0275text(14, " Limpiar filtros ");
      \u0275\u0275domElementEnd()();
    }
    if (rf & 2) {
      \u0275\u0275advance(4);
      \u0275\u0275domProperty("value", ctx.filter().text);
      \u0275\u0275advance(4);
      \u0275\u0275domProperty("value", ctx.filter().status);
      \u0275\u0275advance(3);
      \u0275\u0275repeater(ctx.options);
    }
  }, encapsulation: 2, changeDetection: 0 });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(PaymentFilterComponent, [{
    type: Component,
    args: [{
      selector: "app-payment-filter",
      changeDetection: ChangeDetectionStrategy.OnPush,
      template: `
    <form class="filter" (submit)="$event.preventDefault()">
      <div class="field">
        <label for="search">Buscar</label>
        <input id="search" type="search" placeholder="Beneficiario, concepto o referencia"
          [value]="filter().text" (input)="onText($event)" />
      </div>
      <div class="field">
        <label for="status">Estado</label>
        <select id="status" [value]="filter().status" (change)="onStatus($event)">
          <option value="ALL">Todos</option>
          @for (option of options; track option.value) {
            <option [value]="option.value">{{ option.label }}</option>
          }
        </select>
      </div>
      <button type="button" class="btn-secondary" (click)="filterChange.emit({ text: '', status: 'ALL' })">
        Limpiar filtros
      </button>
    </form>
  `
    }]
  }], null, { filter: [{ type: Input, args: [{ isSignal: true, alias: "filter", required: true }] }], filterChange: [{ type: Output, args: ["filterChange"] }] });
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(PaymentFilterComponent, { className: "PaymentFilterComponent", filePath: "src/app/molecules/payment-filter.component.ts", lineNumber: 30 });
})();

// src/app/organisms/payment-table.component.ts
var _forTrack02 = ($index, $item) => $item.id;
function PaymentTableComponent_Conditional_0_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p", 0);
    \u0275\u0275text(1, "No se encontraron pagos con los criterios indicados.");
    \u0275\u0275elementEnd();
  }
}
function PaymentTableComponent_Conditional_1_For_20_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "tr")(1, "td");
    \u0275\u0275text(2);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "td");
    \u0275\u0275text(4);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(5, "td");
    \u0275\u0275text(6);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(7, "td");
    \u0275\u0275text(8);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(9, "td", 5);
    \u0275\u0275text(10);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(11, "td");
    \u0275\u0275element(12, "app-status-badge", 6);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const p_r1 = ctx.$implicit;
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(p_r1.date);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(p_r1.id);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(p_r1.beneficiary);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(p_r1.concept);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(ctx_r1.format(p_r1));
    \u0275\u0275advance(2);
    \u0275\u0275property("status", p_r1.status);
  }
}
function PaymentTableComponent_Conditional_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 1)(1, "table")(2, "caption", 2);
    \u0275\u0275text(3, "Listado de pagos");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(4, "thead")(5, "tr")(6, "th", 3);
    \u0275\u0275text(7, "Fecha");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(8, "th", 3);
    \u0275\u0275text(9, "Referencia");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(10, "th", 3);
    \u0275\u0275text(11, "Beneficiario");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(12, "th", 3);
    \u0275\u0275text(13, "Concepto");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(14, "th", 4);
    \u0275\u0275text(15, "Monto");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(16, "th", 3);
    \u0275\u0275text(17, "Estado");
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(18, "tbody");
    \u0275\u0275repeaterCreate(19, PaymentTableComponent_Conditional_1_For_20_Template, 13, 6, "tr", null, _forTrack02);
    \u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275advance(19);
    \u0275\u0275repeater(ctx_r1.payments());
  }
}
var PaymentTableComponent = class _PaymentTableComponent {
  payments = input.required(...ngDevMode ? [{ debugName: "payments" }] : []);
  format(p) {
    return formatAmount(p.amount, p.currency);
  }
  static \u0275fac = function PaymentTableComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _PaymentTableComponent)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _PaymentTableComponent, selectors: [["app-payment-table"]], inputs: { payments: [1, "payments"] }, decls: 2, vars: 1, consts: [[1, "empty"], [1, "table-wrap"], [1, "sr-only"], ["scope", "col"], ["scope", "col", 1, "num"], [1, "num"], [3, "status"]], template: function PaymentTableComponent_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275conditionalCreate(0, PaymentTableComponent_Conditional_0_Template, 2, 0, "p", 0)(1, PaymentTableComponent_Conditional_1_Template, 21, 0, "div", 1);
    }
    if (rf & 2) {
      \u0275\u0275conditional(ctx.payments().length === 0 ? 0 : 1);
    }
  }, dependencies: [StatusBadgeComponent], encapsulation: 2, changeDetection: 0 });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(PaymentTableComponent, [{
    type: Component,
    args: [{
      selector: "app-payment-table",
      imports: [StatusBadgeComponent],
      changeDetection: ChangeDetectionStrategy.OnPush,
      template: `
    @if (payments().length === 0) {
      <p class="empty">No se encontraron pagos con los criterios indicados.</p>
    } @else {
      <div class="table-wrap">
        <table>
          <caption class="sr-only">Listado de pagos</caption>
          <thead>
            <tr>
              <th scope="col">Fecha</th>
              <th scope="col">Referencia</th>
              <th scope="col">Beneficiario</th>
              <th scope="col">Concepto</th>
              <th scope="col" class="num">Monto</th>
              <th scope="col">Estado</th>
            </tr>
          </thead>
          <tbody>
            @for (p of payments(); track p.id) {
              <tr>
                <td>{{ p.date }}</td>
                <td>{{ p.id }}</td>
                <td>{{ p.beneficiary }}</td>
                <td>{{ p.concept }}</td>
                <td class="num">{{ format(p) }}</td>
                <td><app-status-badge [status]="p.status" /></td>
              </tr>
            }
          </tbody>
        </table>
      </div>
    }
  `
    }]
  }], null, { payments: [{ type: Input, args: [{ isSignal: true, alias: "payments", required: true }] }] });
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(PaymentTableComponent, { className: "PaymentTableComponent", filePath: "src/app/organisms/payment-table.component.ts", lineNumber: 45 });
})();

// src/app/pages/payments-page.component.ts
function PaymentsPageComponent_Case_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p", 0);
    \u0275\u0275text(1, "Cargando pagos\u2026");
    \u0275\u0275elementEnd();
  }
}
function PaymentsPageComponent_Case_3_Template(rf, ctx) {
  if (rf & 1) {
    const _r1 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 1)(1, "p");
    \u0275\u0275text(2, "No pudimos cargar tus pagos. Intenta nuevamente.");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "button", 2);
    \u0275\u0275listener("click", function PaymentsPageComponent_Case_3_Template_button_click_3_listener() {
      \u0275\u0275restoreView(_r1);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.load());
    });
    \u0275\u0275text(4, "Reintentar");
    \u0275\u0275elementEnd()();
  }
}
function PaymentsPageComponent_Case_4_Conditional_3_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275text(0);
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275textInterpolate1(" Total completado: ", ctx_r1.totalLabel(), ". ");
  }
}
function PaymentsPageComponent_Case_4_Template(rf, ctx) {
  if (rf & 1) {
    const _r3 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "app-payment-filter", 3);
    \u0275\u0275listener("filterChange", function PaymentsPageComponent_Case_4_Template_app_payment_filter_filterChange_0_listener($event) {
      \u0275\u0275restoreView(_r3);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.filter.set($event));
    });
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(1, "p", 0);
    \u0275\u0275text(2);
    \u0275\u0275conditionalCreate(3, PaymentsPageComponent_Case_4_Conditional_3_Template, 1, 1);
    \u0275\u0275elementEnd();
    \u0275\u0275element(4, "app-payment-table", 4);
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275property("filter", ctx_r1.filter());
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate2(" ", ctx_r1.visible().length, " de ", ctx_r1.payments().length, " pagos. ");
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r1.totalLabel() ? 3 : -1);
    \u0275\u0275advance();
    \u0275\u0275property("payments", ctx_r1.visible());
  }
}
var PaymentsPageComponent = class _PaymentsPageComponent {
  repository = inject(PaymentRepository);
  state = signal("loading", ...ngDevMode ? [{ debugName: "state" }] : []);
  payments = signal([], ...ngDevMode ? [{ debugName: "payments" }] : []);
  filter = signal(EMPTY_FILTER, ...ngDevMode ? [{ debugName: "filter" }] : []);
  visible = computed(() => sortByDateDesc(filterPayments(this.payments(), this.filter())), ...ngDevMode ? [{ debugName: "visible" }] : []);
  totalLabel = computed(() => Object.entries(totalCompletedByCurrency(this.visible())).map(([currency, amount]) => formatAmount(amount, currency)).join(" \xB7 "), ...ngDevMode ? [{ debugName: "totalLabel" }] : []);
  ngOnInit() {
    void this.load();
  }
  async load() {
    this.state.set("loading");
    try {
      this.payments.set(await this.repository.list());
      this.state.set("success");
    } catch {
      this.state.set("error");
    }
  }
  static \u0275fac = function PaymentsPageComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _PaymentsPageComponent)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _PaymentsPageComponent, selectors: [["app-payments-page"]], decls: 5, vars: 1, consts: [["role", "status", 1, "info"], ["role", "alert", 1, "error"], ["type", "button", 3, "click"], [3, "filterChange", "filter"], [3, "payments"]], template: function PaymentsPageComponent_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275elementStart(0, "h1");
      \u0275\u0275text(1, "Consulta de pagos");
      \u0275\u0275elementEnd();
      \u0275\u0275conditionalCreate(2, PaymentsPageComponent_Case_2_Template, 2, 0, "p", 0)(3, PaymentsPageComponent_Case_3_Template, 5, 0, "div", 1)(4, PaymentsPageComponent_Case_4_Template, 5, 5);
    }
    if (rf & 2) {
      let tmp_0_0;
      \u0275\u0275advance(2);
      \u0275\u0275conditional((tmp_0_0 = ctx.state()) === "loading" ? 2 : tmp_0_0 === "error" ? 3 : tmp_0_0 === "success" ? 4 : -1);
    }
  }, dependencies: [PaymentFilterComponent, PaymentTableComponent], encapsulation: 2, changeDetection: 0 });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(PaymentsPageComponent, [{
    type: Component,
    args: [{
      selector: "app-payments-page",
      imports: [PaymentFilterComponent, PaymentTableComponent],
      changeDetection: ChangeDetectionStrategy.OnPush,
      template: `
    <h1>Consulta de pagos</h1>

    @switch (state()) {
      @case ('loading') {
        <p role="status" class="info">Cargando pagos\u2026</p>
      }
      @case ('error') {
        <div role="alert" class="error">
          <p>No pudimos cargar tus pagos. Intenta nuevamente.</p>
          <button type="button" (click)="load()">Reintentar</button>
        </div>
      }
      @case ('success') {
        <app-payment-filter [filter]="filter()" (filterChange)="filter.set($event)" />
        <p role="status" class="info">
          {{ visible().length }} de {{ payments().length }} pagos.
          @if (totalLabel()) { Total completado: {{ totalLabel() }}. }
        </p>
        <app-payment-table [payments]="visible()" />
      }
    }
  `
    }]
  }], null, null);
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(PaymentsPageComponent, { className: "PaymentsPageComponent", filePath: "src/app/pages/payments-page.component.ts", lineNumber: 39 });
})();

// src/app/pages/payments-page.component.spec.ts
var FakeRepository = class extends PaymentRepository {
  behavior;
  constructor(behavior) {
    super();
    this.behavior = behavior;
  }
  list() {
    return this.behavior();
  }
};
function setup(behavior) {
  TestBed.configureTestingModule({
    providers: [
      provideZonelessChangeDetection(),
      { provide: PaymentRepository, useValue: new FakeRepository(behavior) }
    ]
  });
  const fixture = TestBed.createComponent(PaymentsPageComponent);
  return { fixture, el: fixture.nativeElement };
}
describe("PaymentsPageComponent", () => {
  beforeEach(() => TestBed.resetTestingModule());
  it("given repositorio con datos when carga then lista todos los pagos", async () => {
    const { fixture, el } = setup(() => Promise.resolve([...SAMPLE_PAYMENTS]));
    await fixture.whenStable();
    expect(el.querySelectorAll("tbody tr").length).toBe(SAMPLE_PAYMENTS.length);
    expect(el.querySelector('[role="status"]')?.textContent).toContain(`${SAMPLE_PAYMENTS.length} de ${SAMPLE_PAYMENTS.length}`);
  });
  it("given texto de b\xFAsqueda when escribe then filtra la tabla", async () => {
    const { fixture, el } = setup(() => Promise.resolve([...SAMPLE_PAYMENTS]));
    await fixture.whenStable();
    const input2 = el.querySelector("#search");
    input2.value = "seguros";
    input2.dispatchEvent(new Event("input"));
    await fixture.whenStable();
    expect(el.querySelectorAll("tbody tr").length).toBe(1);
    expect(el.textContent).toContain("Seguros Demo");
  });
  it("given b\xFAsqueda sin resultados when filtra then muestra estado vac\xEDo", async () => {
    const { fixture, el } = setup(() => Promise.resolve([...SAMPLE_PAYMENTS]));
    await fixture.whenStable();
    const input2 = el.querySelector("#search");
    input2.value = "no-existe";
    input2.dispatchEvent(new Event("input"));
    await fixture.whenStable();
    expect(el.querySelector(".empty")).not.toBeNull();
  });
  it("given repositorio que falla when carga then muestra alerta de error", async () => {
    const { fixture, el } = setup(() => Promise.reject(new Error("fallo simulado")));
    await fixture.whenStable();
    expect(el.querySelector('[role="alert"]')?.textContent).toContain("No pudimos cargar");
  });
});
//# sourceMappingURL=spec-payments-page.component.spec.js.map
