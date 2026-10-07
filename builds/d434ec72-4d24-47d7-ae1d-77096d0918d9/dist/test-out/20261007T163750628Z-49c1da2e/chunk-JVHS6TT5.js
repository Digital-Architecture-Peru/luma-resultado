import {
  ChangeDetectionStrategy,
  Component,
  Input,
  Output,
  input,
  output,
  setClassMetadata,
  ɵsetClassDebugInfo,
  ɵɵadvance,
  ɵɵclassProp,
  ɵɵdefineComponent,
  ɵɵdomElementEnd,
  ɵɵdomElementStart,
  ɵɵdomListener,
  ɵɵdomProperty,
  ɵɵtext,
  ɵɵtextInterpolate1
} from "./chunk-JSDFT7HK.js";

// src/app/atoms/app-button.ts
var AppButton = class _AppButton {
  label = input.required(...ngDevMode ? [{ debugName: "label" }] : []);
  type = input("button", ...ngDevMode ? [{ debugName: "type" }] : []);
  variant = input("primary", ...ngDevMode ? [{ debugName: "variant" }] : []);
  disabled = input(false, ...ngDevMode ? [{ debugName: "disabled" }] : []);
  pressed = output();
  static \u0275fac = function AppButton_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _AppButton)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _AppButton, selectors: [["app-button"]], inputs: { label: [1, "label"], type: [1, "type"], variant: [1, "variant"], disabled: [1, "disabled"] }, outputs: { pressed: "pressed" }, decls: 2, vars: 5, consts: [[1, "btn", 3, "click", "type", "disabled"]], template: function AppButton_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275domElementStart(0, "button", 0);
      \u0275\u0275domListener("click", function AppButton_Template_button_click_0_listener() {
        return ctx.pressed.emit();
      });
      \u0275\u0275text(1);
      \u0275\u0275domElementEnd();
    }
    if (rf & 2) {
      \u0275\u0275classProp("btn-secondary", ctx.variant() === "secondary");
      \u0275\u0275domProperty("type", ctx.type())("disabled", ctx.disabled());
      \u0275\u0275advance();
      \u0275\u0275textInterpolate1(" ", ctx.label(), " ");
    }
  }, encapsulation: 2, changeDetection: 0 });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(AppButton, [{
    type: Component,
    args: [{
      selector: "app-button",
      changeDetection: ChangeDetectionStrategy.OnPush,
      template: `
    <button
      class="btn"
      [class.btn-secondary]="variant() === 'secondary'"
      [type]="type()"
      [disabled]="disabled()"
      (click)="pressed.emit()"
    >
      {{ label() }}
    </button>
  `
    }]
  }], null, { label: [{ type: Input, args: [{ isSignal: true, alias: "label", required: true }] }], type: [{ type: Input, args: [{ isSignal: true, alias: "type", required: false }] }], variant: [{ type: Input, args: [{ isSignal: true, alias: "variant", required: false }] }], disabled: [{ type: Input, args: [{ isSignal: true, alias: "disabled", required: false }] }], pressed: [{ type: Output, args: ["pressed"] }] });
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(AppButton, { className: "AppButton", filePath: "src/app/atoms/app-button.ts", lineNumber: 18 });
})();

export {
  AppButton
};
//# sourceMappingURL=chunk-JVHS6TT5.js.map
