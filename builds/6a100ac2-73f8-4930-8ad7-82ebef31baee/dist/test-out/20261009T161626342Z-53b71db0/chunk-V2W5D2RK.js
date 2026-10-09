import {
  ChangeDetectionStrategy,
  Component,
  Input,
  computed,
  input,
  setClassMetadata,
  ɵsetClassDebugInfo,
  ɵɵadvance,
  ɵɵclassMap,
  ɵɵdefineComponent,
  ɵɵdomElementEnd,
  ɵɵdomElementStart,
  ɵɵtext,
  ɵɵtextInterpolate
} from "./chunk-W5AVGSS5.js";

// src/app/domain/payment.model.ts
var EMPTY_FILTER = { text: "", status: "ALL" };
var STATUS_LABELS = {
  COMPLETED: "Completado",
  PENDING: "Pendiente",
  REJECTED: "Rechazado"
};

// src/app/atoms/status-badge.component.ts
var StatusBadgeComponent = class _StatusBadgeComponent {
  status = input.required(...ngDevMode ? [{ debugName: "status" }] : []);
  label = computed(() => STATUS_LABELS[this.status()], ...ngDevMode ? [{ debugName: "label" }] : []);
  static \u0275fac = function StatusBadgeComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _StatusBadgeComponent)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _StatusBadgeComponent, selectors: [["app-status-badge"]], inputs: { status: [1, "status"] }, decls: 2, vars: 3, consts: [[1, "badge"]], template: function StatusBadgeComponent_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275domElementStart(0, "span", 0);
      \u0275\u0275text(1);
      \u0275\u0275domElementEnd();
    }
    if (rf & 2) {
      \u0275\u0275classMap("badge-" + ctx.status().toLowerCase());
      \u0275\u0275advance();
      \u0275\u0275textInterpolate(ctx.label());
    }
  }, encapsulation: 2, changeDetection: 0 });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(StatusBadgeComponent, [{
    type: Component,
    args: [{
      selector: "app-status-badge",
      changeDetection: ChangeDetectionStrategy.OnPush,
      template: `<span class="badge" [class]="'badge-' + status().toLowerCase()">{{ label() }}</span>`
    }]
  }], null, { status: [{ type: Input, args: [{ isSignal: true, alias: "status", required: true }] }] });
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(StatusBadgeComponent, { className: "StatusBadgeComponent", filePath: "src/app/atoms/status-badge.component.ts", lineNumber: 10 });
})();

export {
  EMPTY_FILTER,
  STATUS_LABELS,
  StatusBadgeComponent
};
//# sourceMappingURL=chunk-V2W5D2RK.js.map
