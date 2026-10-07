import {
  TRANSACTION_TYPE_LABELS
} from "./chunk-3BDUIL3P.js";
import {
  AppButton
} from "./chunk-JVHS6TT5.js";
import {
  parseAmount,
  validateTransaction
} from "./chunk-RUOCWWY3.js";
import {
  ChangeDetectionStrategy,
  Component,
  Input,
  Output,
  computed,
  input,
  output,
  setClassMetadata,
  signal,
  ɵsetClassDebugInfo,
  ɵɵadvance,
  ɵɵattribute,
  ɵɵconditional,
  ɵɵconditionalCreate,
  ɵɵdefineComponent,
  ɵɵdomElementEnd,
  ɵɵdomElementStart,
  ɵɵdomProperty,
  ɵɵelement,
  ɵɵelementEnd,
  ɵɵelementStart,
  ɵɵlistener,
  ɵɵnextContext,
  ɵɵprojection,
  ɵɵprojectionDef,
  ɵɵproperty,
  ɵɵrepeater,
  ɵɵrepeaterCreate,
  ɵɵrepeaterTrackByIdentity,
  ɵɵtext,
  ɵɵtextInterpolate,
  ɵɵtextInterpolate1,
  ɵɵtextInterpolate2
} from "./chunk-JSDFT7HK.js";

// src/app/molecules/form-field.ts
var _c0 = ["*"];
function FormField_Conditional_4_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275domElementStart(0, "p", 1);
    \u0275\u0275text(1);
    \u0275\u0275domElementEnd();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275domProperty("id", ctx_r0.controlId() + "-error");
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(ctx_r0.error());
  }
}
var FormField = class _FormField {
  label = input.required(...ngDevMode ? [{ debugName: "label" }] : []);
  controlId = input.required(...ngDevMode ? [{ debugName: "controlId" }] : []);
  error = input(null, ...ngDevMode ? [{ debugName: "error" }] : []);
  static \u0275fac = function FormField_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _FormField)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _FormField, selectors: [["app-form-field"]], inputs: { label: [1, "label"], controlId: [1, "controlId"], error: [1, "error"] }, ngContentSelectors: _c0, decls: 5, vars: 3, consts: [[1, "field"], [1, "field-error", 3, "id"]], template: function FormField_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275projectionDef();
      \u0275\u0275domElementStart(0, "div", 0)(1, "label");
      \u0275\u0275text(2);
      \u0275\u0275domElementEnd();
      \u0275\u0275projection(3);
      \u0275\u0275conditionalCreate(4, FormField_Conditional_4_Template, 2, 2, "p", 1);
      \u0275\u0275domElementEnd();
    }
    if (rf & 2) {
      \u0275\u0275advance();
      \u0275\u0275attribute("for", ctx.controlId());
      \u0275\u0275advance();
      \u0275\u0275textInterpolate(ctx.label());
      \u0275\u0275advance(2);
      \u0275\u0275conditional(ctx.error() ? 4 : -1);
    }
  }, encapsulation: 2, changeDetection: 0 });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(FormField, [{
    type: Component,
    args: [{
      selector: "app-form-field",
      changeDetection: ChangeDetectionStrategy.OnPush,
      template: `
    <div class="field">
      <label [attr.for]="controlId()">{{ label() }}</label>
      <ng-content />
      @if (error()) {
        <p class="field-error" [id]="controlId() + '-error'">{{ error() }}</p>
      }
    </div>
  `
    }]
  }], null, { label: [{ type: Input, args: [{ isSignal: true, alias: "label", required: true }] }], controlId: [{ type: Input, args: [{ isSignal: true, alias: "controlId", required: true }] }], error: [{ type: Input, args: [{ isSignal: true, alias: "error", required: false }] }] });
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(FormField, { className: "FormField", filePath: "src/app/molecules/form-field.ts", lineNumber: 17 });
})();

// src/app/organisms/transaction-form.ts
var _forTrack0 = ($index, $item) => $item.id;
var _forTrack1 = ($index, $item) => $item.value;
function TransactionForm_For_6_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "option", 3);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const card_r1 = ctx.$implicit;
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275property("value", card_r1.id)("selected", card_r1.id === ctx_r1.selectedCardId());
    \u0275\u0275advance();
    \u0275\u0275textInterpolate2(" ", card_r1.alias, " \xB7 ", card_r1.maskedNumber, " ");
  }
}
function TransactionForm_For_10_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "option", 3);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const option_r3 = ctx.$implicit;
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275property("value", option_r3.value)("selected", option_r3.value === ctx_r1.type());
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", option_r3.label, " ");
  }
}
function TransactionForm_Conditional_15_For_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "li");
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const message_r4 = ctx.$implicit;
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(message_r4);
  }
}
function TransactionForm_Conditional_15_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "ul", 10);
    \u0275\u0275repeaterCreate(1, TransactionForm_Conditional_15_For_2_Template, 2, 1, "li", null, \u0275\u0275repeaterTrackByIdentity);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275repeater(ctx_r1.errors());
  }
}
var TransactionForm = class _TransactionForm {
  cards = input.required(...ngDevMode ? [{ debugName: "cards" }] : []);
  selectedCardId = input(null, ...ngDevMode ? [{ debugName: "selectedCardId" }] : []);
  busy = input(false, ...ngDevMode ? [{ debugName: "busy" }] : []);
  cardChange = output();
  submitted = output();
  typeOptions = Object.keys(TRANSACTION_TYPE_LABELS).map((value) => ({ value, label: TRANSACTION_TYPE_LABELS[value] }));
  type = signal("PURCHASE", ...ngDevMode ? [{ debugName: "type" }] : []);
  amount = signal("", ...ngDevMode ? [{ debugName: "amount" }] : []);
  description = signal("", ...ngDevMode ? [{ debugName: "description" }] : []);
  errors = signal([], ...ngDevMode ? [{ debugName: "errors" }] : []);
  selectedCard = computed(() => this.cards().find((card) => card.id === this.selectedCardId()), ...ngDevMode ? [{ debugName: "selectedCard" }] : []);
  valueOf(event) {
    return event.target.value;
  }
  onCardChange(event) {
    this.errors.set([]);
    this.cardChange.emit(this.valueOf(event));
  }
  onTypeChange(event) {
    this.type.set(this.valueOf(event));
  }
  onSubmit(event) {
    event.preventDefault();
    const card = this.selectedCard();
    const request = {
      cardId: card?.id ?? "",
      type: this.type(),
      amount: parseAmount(this.amount()),
      description: this.description().trim()
    };
    const errors = validateTransaction(request, card);
    this.errors.set(errors);
    if (errors.length === 0) {
      this.submitted.emit(request);
      this.amount.set("");
      this.description.set("");
    }
  }
  static \u0275fac = function TransactionForm_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _TransactionForm)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _TransactionForm, selectors: [["app-transaction-form"]], inputs: { cards: [1, "cards"], selectedCardId: [1, "selectedCardId"], busy: [1, "busy"] }, outputs: { cardChange: "cardChange", submitted: "submitted" }, decls: 17, vars: 5, consts: [["novalidate", "", 1, "panel", 3, "submit"], ["label", "Tarjeta", "controlId", "card"], ["id", "card", "name", "card", 3, "change"], [3, "value", "selected"], ["label", "Tipo de operaci\xF3n", "controlId", "type"], ["id", "type", "name", "type", 3, "change"], ["label", "Monto", "controlId", "amount"], ["id", "amount", "name", "amount", "inputmode", "decimal", "autocomplete", "off", "placeholder", "0.00", 3, "input", "value"], ["label", "Descripci\xF3n", "controlId", "description"], ["id", "description", "name", "description", "autocomplete", "off", "maxlength", "60", 3, "input", "value"], ["role", "alert", 1, "error-list"], ["type", "submit", 3, "label", "disabled"]], template: function TransactionForm_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275elementStart(0, "form", 0);
      \u0275\u0275listener("submit", function TransactionForm_Template_form_submit_0_listener($event) {
        return ctx.onSubmit($event);
      });
      \u0275\u0275elementStart(1, "h2");
      \u0275\u0275text(2, "Nueva transacci\xF3n");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(3, "app-form-field", 1)(4, "select", 2);
      \u0275\u0275listener("change", function TransactionForm_Template_select_change_4_listener($event) {
        return ctx.onCardChange($event);
      });
      \u0275\u0275repeaterCreate(5, TransactionForm_For_6_Template, 2, 4, "option", 3, _forTrack0);
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(7, "app-form-field", 4)(8, "select", 5);
      \u0275\u0275listener("change", function TransactionForm_Template_select_change_8_listener($event) {
        return ctx.onTypeChange($event);
      });
      \u0275\u0275repeaterCreate(9, TransactionForm_For_10_Template, 2, 3, "option", 3, _forTrack1);
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(11, "app-form-field", 6)(12, "input", 7);
      \u0275\u0275listener("input", function TransactionForm_Template_input_input_12_listener($event) {
        return ctx.amount.set(ctx.valueOf($event));
      });
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(13, "app-form-field", 8)(14, "input", 9);
      \u0275\u0275listener("input", function TransactionForm_Template_input_input_14_listener($event) {
        return ctx.description.set(ctx.valueOf($event));
      });
      \u0275\u0275elementEnd()();
      \u0275\u0275conditionalCreate(15, TransactionForm_Conditional_15_Template, 3, 0, "ul", 10);
      \u0275\u0275element(16, "app-button", 11);
      \u0275\u0275elementEnd();
    }
    if (rf & 2) {
      \u0275\u0275advance(5);
      \u0275\u0275repeater(ctx.cards());
      \u0275\u0275advance(4);
      \u0275\u0275repeater(ctx.typeOptions);
      \u0275\u0275advance(3);
      \u0275\u0275property("value", ctx.amount());
      \u0275\u0275advance(2);
      \u0275\u0275property("value", ctx.description());
      \u0275\u0275advance();
      \u0275\u0275conditional(ctx.errors().length > 0 ? 15 : -1);
      \u0275\u0275advance();
      \u0275\u0275property("label", ctx.busy() ? "Procesando\u2026" : "Confirmar transacci\xF3n")("disabled", ctx.busy());
    }
  }, dependencies: [AppButton, FormField], encapsulation: 2, changeDetection: 0 });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(TransactionForm, [{
    type: Component,
    args: [{
      selector: "app-transaction-form",
      imports: [AppButton, FormField],
      changeDetection: ChangeDetectionStrategy.OnPush,
      template: `
    <form class="panel" novalidate (submit)="onSubmit($event)">
      <h2>Nueva transacci\xF3n</h2>

      <app-form-field label="Tarjeta" controlId="card">
        <select id="card" name="card" (change)="onCardChange($event)">
          @for (card of cards(); track card.id) {
            <option [value]="card.id" [selected]="card.id === selectedCardId()">
              {{ card.alias }} \xB7 {{ card.maskedNumber }}
            </option>
          }
        </select>
      </app-form-field>

      <app-form-field label="Tipo de operaci\xF3n" controlId="type">
        <select id="type" name="type" (change)="onTypeChange($event)">
          @for (option of typeOptions; track option.value) {
            <option [value]="option.value" [selected]="option.value === type()">
              {{ option.label }}
            </option>
          }
        </select>
      </app-form-field>

      <app-form-field label="Monto" controlId="amount">
        <input
          id="amount"
          name="amount"
          inputmode="decimal"
          autocomplete="off"
          placeholder="0.00"
          [value]="amount()"
          (input)="amount.set(valueOf($event))"
        />
      </app-form-field>

      <app-form-field label="Descripci\xF3n" controlId="description">
        <input
          id="description"
          name="description"
          autocomplete="off"
          maxlength="60"
          [value]="description()"
          (input)="description.set(valueOf($event))"
        />
      </app-form-field>

      @if (errors().length > 0) {
        <ul class="error-list" role="alert">
          @for (message of errors(); track message) {
            <li>{{ message }}</li>
          }
        </ul>
      }

      <app-button
        type="submit"
        [label]="busy() ? 'Procesando\u2026' : 'Confirmar transacci\xF3n'"
        [disabled]="busy()"
      />
    </form>
  `
    }]
  }], null, { cards: [{ type: Input, args: [{ isSignal: true, alias: "cards", required: true }] }], selectedCardId: [{ type: Input, args: [{ isSignal: true, alias: "selectedCardId", required: false }] }], busy: [{ type: Input, args: [{ isSignal: true, alias: "busy", required: false }] }], cardChange: [{ type: Output, args: ["cardChange"] }], submitted: [{ type: Output, args: ["submitted"] }] });
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(TransactionForm, { className: "TransactionForm", filePath: "src/app/organisms/transaction-form.ts", lineNumber: 79 });
})();

export {
  TransactionForm
};
//# sourceMappingURL=chunk-3KST47PQ.js.map
