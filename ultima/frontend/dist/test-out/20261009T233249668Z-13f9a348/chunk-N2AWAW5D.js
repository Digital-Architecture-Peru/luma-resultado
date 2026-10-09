import {
  DatePipe
} from "./chunk-FIVU76E7.js";
import {
  ChangeDetectionStrategy,
  Component,
  Input,
  Output,
  computed,
  input,
  output,
  setClassMetadata,
  ɵsetClassDebugInfo,
  ɵɵadvance,
  ɵɵclassMap,
  ɵɵclassProp,
  ɵɵconditional,
  ɵɵconditionalCreate,
  ɵɵdefineComponent,
  ɵɵdomElementEnd,
  ɵɵdomElementStart,
  ɵɵdomListener,
  ɵɵdomProperty,
  ɵɵelement,
  ɵɵelementEnd,
  ɵɵelementStart,
  ɵɵgetCurrentView,
  ɵɵlistener,
  ɵɵnextContext,
  ɵɵpipe,
  ɵɵpipeBind2,
  ɵɵprojection,
  ɵɵprojectionDef,
  ɵɵproperty,
  ɵɵresetView,
  ɵɵrestoreView,
  ɵɵtext,
  ɵɵtextInterpolate,
  ɵɵtextInterpolate1,
  ɵɵtextInterpolate2
} from "./chunk-PUETN2RN.js";

// src/app/notifications/atoms/badge.component.ts
var _c0 = ["*"];
var BadgeComponent = class _BadgeComponent {
  tone = input("info", ...ngDevMode ? [{ debugName: "tone" }] : []);
  static \u0275fac = function BadgeComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _BadgeComponent)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _BadgeComponent, selectors: [["app-badge"]], inputs: { tone: [1, "tone"] }, ngContentSelectors: _c0, decls: 2, vars: 2, consts: [[1, "badge"]], template: function BadgeComponent_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275projectionDef();
      \u0275\u0275domElementStart(0, "span", 0);
      \u0275\u0275projection(1);
      \u0275\u0275domElementEnd();
    }
    if (rf & 2) {
      \u0275\u0275classMap("badge " + ctx.tone());
    }
  }, styles: ["\n\n.badge[_ngcontent-%COMP%] {\n  display: inline-block;\n  padding: 0 var(--space-2);\n  border: 1px solid currentColor;\n  border-radius: 999px;\n  font-size: 0.75rem;\n  font-weight: 600;\n}\n.info[_ngcontent-%COMP%] {\n  color: var(--primary);\n}\n.success[_ngcontent-%COMP%] {\n  color: var(--success);\n}\n.warn[_ngcontent-%COMP%] {\n  color: var(--warn);\n}\n.danger[_ngcontent-%COMP%] {\n  color: var(--danger);\n}"], changeDetection: 0 });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(BadgeComponent, [{
    type: Component,
    args: [{ selector: "app-badge", changeDetection: ChangeDetectionStrategy.OnPush, template: `<span class="badge" [class]="'badge ' + tone()"><ng-content /></span>`, styles: ["/* angular:styles/component:css;728b6035502986943bf9a5a592c622d9f63f72f3ab6ec9162215dfd5b55a9e3b;C:/Users/josec/OneDrive/Documentos/prueba_vb6/proyecto vb6/microapp-builder-url/.local/workspaces/stack-d0b46db1-6949-4dda-b534-71a51e3273de/frontend/src/app/notifications/atoms/badge.component.ts */\n.badge {\n  display: inline-block;\n  padding: 0 var(--space-2);\n  border: 1px solid currentColor;\n  border-radius: 999px;\n  font-size: 0.75rem;\n  font-weight: 600;\n}\n.info {\n  color: var(--primary);\n}\n.success {\n  color: var(--success);\n}\n.warn {\n  color: var(--warn);\n}\n.danger {\n  color: var(--danger);\n}\n"] }]
  }], null, { tone: [{ type: Input, args: [{ isSignal: true, alias: "tone", required: false }] }] });
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(BadgeComponent, { className: "BadgeComponent", filePath: "src/app/notifications/atoms/badge.component.ts", lineNumber: 18 });
})();

// src/app/notifications/atoms/button.component.ts
var _c02 = ["*"];
var ButtonComponent = class _ButtonComponent {
  disabled = input(false, ...ngDevMode ? [{ debugName: "disabled" }] : []);
  pressed = output();
  static \u0275fac = function ButtonComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _ButtonComponent)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _ButtonComponent, selectors: [["app-button"]], inputs: { disabled: [1, "disabled"] }, outputs: { pressed: "pressed" }, ngContentSelectors: _c02, decls: 2, vars: 1, consts: [["type", "button", 3, "click", "disabled"]], template: function ButtonComponent_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275projectionDef();
      \u0275\u0275domElementStart(0, "button", 0);
      \u0275\u0275domListener("click", function ButtonComponent_Template_button_click_0_listener() {
        return ctx.pressed.emit();
      });
      \u0275\u0275projection(1);
      \u0275\u0275domElementEnd();
    }
    if (rf & 2) {
      \u0275\u0275domProperty("disabled", ctx.disabled());
    }
  }, styles: ["\n\nbutton[_ngcontent-%COMP%] {\n  min-height: 40px;\n  padding: 0 var(--space-4);\n  border: 1px solid var(--primary);\n  border-radius: var(--radius-md);\n  background: var(--primary);\n  color: var(--primary-contrast);\n  font: inherit;\n  cursor: pointer;\n  transition: opacity var(--dur-fast);\n}\nbutton[_ngcontent-%COMP%]:disabled {\n  opacity: 0.5;\n  cursor: not-allowed;\n}"], changeDetection: 0 });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(ButtonComponent, [{
    type: Component,
    args: [{ selector: "app-button", changeDetection: ChangeDetectionStrategy.OnPush, template: `<button type="button" [disabled]="disabled()" (click)="pressed.emit()"><ng-content /></button>`, styles: ["/* angular:styles/component:css;84db23035b45b5ff818ebb978324e497aa1ca5da7ea37d7f20f931467d38a76a;C:/Users/josec/OneDrive/Documentos/prueba_vb6/proyecto vb6/microapp-builder-url/.local/workspaces/stack-d0b46db1-6949-4dda-b534-71a51e3273de/frontend/src/app/notifications/atoms/button.component.ts */\nbutton {\n  min-height: 40px;\n  padding: 0 var(--space-4);\n  border: 1px solid var(--primary);\n  border-radius: var(--radius-md);\n  background: var(--primary);\n  color: var(--primary-contrast);\n  font: inherit;\n  cursor: pointer;\n  transition: opacity var(--dur-fast);\n}\nbutton:disabled {\n  opacity: 0.5;\n  cursor: not-allowed;\n}\n"] }]
  }], null, { disabled: [{ type: Input, args: [{ isSignal: true, alias: "disabled", required: false }] }], pressed: [{ type: Output, args: ["pressed"] }] });
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(ButtonComponent, { className: "ButtonComponent", filePath: "src/app/notifications/atoms/button.component.ts", lineNumber: 14 });
})();

// src/app/notifications/atoms/type-icon.component.ts
var GLYPHS = {
  TRANSACTION: "\u{1F4B3}",
  PAYMENT_DUE: "\u{1F4C5}",
  LIMIT_REACHED: "\u26A0\uFE0F",
  CARD_BLOCKED: "\u{1F512}"
};
var TYPE_LABELS = {
  TRANSACTION: "Movimiento",
  PAYMENT_DUE: "Pago",
  LIMIT_REACHED: "L\xEDmite",
  CARD_BLOCKED: "Bloqueo"
};
var TypeIconComponent = class _TypeIconComponent {
  type = input.required(...ngDevMode ? [{ debugName: "type" }] : []);
  glyph = computed(() => GLYPHS[this.type()], ...ngDevMode ? [{ debugName: "glyph" }] : []);
  static \u0275fac = function TypeIconComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _TypeIconComponent)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _TypeIconComponent, selectors: [["app-type-icon"]], inputs: { type: [1, "type"] }, decls: 2, vars: 1, consts: [["aria-hidden", "true"]], template: function TypeIconComponent_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275domElementStart(0, "span", 0);
      \u0275\u0275text(1);
      \u0275\u0275domElementEnd();
    }
    if (rf & 2) {
      \u0275\u0275advance();
      \u0275\u0275textInterpolate(ctx.glyph());
    }
  }, encapsulation: 2, changeDetection: 0 });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(TypeIconComponent, [{
    type: Component,
    args: [{
      selector: "app-type-icon",
      changeDetection: ChangeDetectionStrategy.OnPush,
      template: `<span aria-hidden="true">{{ glyph() }}</span>`
    }]
  }], null, { type: [{ type: Input, args: [{ isSignal: true, alias: "type", required: true }] }] });
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(TypeIconComponent, { className: "TypeIconComponent", filePath: "src/app/notifications/atoms/type-icon.component.ts", lineNumber: 24 });
})();

// src/app/notifications/molecules/notification-item.component.ts
function NotificationItemComponent_Conditional_15_Template(rf, ctx) {
  if (rf & 1) {
    const _r1 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "app-button", 6);
    \u0275\u0275listener("pressed", function NotificationItemComponent_Conditional_15_Template_app_button_pressed_0_listener() {
      \u0275\u0275restoreView(_r1);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.markRead.emit(ctx_r1.notification().id));
    });
    \u0275\u0275text(1, "Marcar como le\xEDda");
    \u0275\u0275elementEnd();
  }
}
var NotificationItemComponent = class _NotificationItemComponent {
  notification = input.required(...ngDevMode ? [{ debugName: "notification" }] : []);
  markRead = output();
  typeLabel = computed(() => TYPE_LABELS[this.notification().type], ...ngDevMode ? [{ debugName: "typeLabel" }] : []);
  static \u0275fac = function NotificationItemComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _NotificationItemComponent)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _NotificationItemComponent, selectors: [["app-notification-item"]], inputs: { notification: [1, "notification"] }, outputs: { markRead: "markRead" }, decls: 16, vars: 14, consts: [[1, "item"], [3, "type"], [1, "body"], [1, "actions"], [3, "tone"], ["tone", "warn"], [3, "pressed"]], template: function NotificationItemComponent_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275elementStart(0, "article", 0);
      \u0275\u0275element(1, "app-type-icon", 1);
      \u0275\u0275elementStart(2, "div", 2)(3, "h3");
      \u0275\u0275text(4);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(5, "p");
      \u0275\u0275text(6);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(7, "small");
      \u0275\u0275text(8);
      \u0275\u0275pipe(9, "date");
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(10, "div", 3)(11, "app-badge", 4);
      \u0275\u0275text(12);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(13, "app-badge", 5);
      \u0275\u0275text(14);
      \u0275\u0275elementEnd();
      \u0275\u0275conditionalCreate(15, NotificationItemComponent_Conditional_15_Template, 2, 0, "app-button");
      \u0275\u0275elementEnd()();
    }
    if (rf & 2) {
      \u0275\u0275classProp("unread", ctx.notification().status === "UNREAD");
      \u0275\u0275advance();
      \u0275\u0275property("type", ctx.notification().type);
      \u0275\u0275advance(3);
      \u0275\u0275textInterpolate(ctx.notification().title);
      \u0275\u0275advance(2);
      \u0275\u0275textInterpolate(ctx.notification().message);
      \u0275\u0275advance(2);
      \u0275\u0275textInterpolate2(" Tarjeta ****", ctx.notification().last4, " \xB7 ", \u0275\u0275pipeBind2(9, 11, ctx.notification().createdAt, "short"), " ");
      \u0275\u0275advance(3);
      \u0275\u0275property("tone", ctx.notification().status === "UNREAD" ? "info" : "success");
      \u0275\u0275advance();
      \u0275\u0275textInterpolate1(" ", ctx.notification().status === "UNREAD" ? "Nueva" : "Le\xEDda", " ");
      \u0275\u0275advance(2);
      \u0275\u0275textInterpolate(ctx.typeLabel());
      \u0275\u0275advance();
      \u0275\u0275conditional(ctx.notification().status === "UNREAD" ? 15 : -1);
    }
  }, dependencies: [BadgeComponent, ButtonComponent, TypeIconComponent, DatePipe], styles: ["\n\n.item[_ngcontent-%COMP%] {\n  display: flex;\n  gap: var(--space-4);\n  align-items: flex-start;\n  padding: var(--space-4);\n  background: var(--surface);\n  border: 1px solid var(--border);\n  border-radius: var(--radius-md);\n  box-shadow: var(--shadow-sm);\n}\n.unread[_ngcontent-%COMP%] {\n  border-inline-start: 4px solid var(--primary);\n}\n.body[_ngcontent-%COMP%] {\n  flex: 1;\n}\nh3[_ngcontent-%COMP%] {\n  margin: 0;\n  font-size: 1rem;\n}\np[_ngcontent-%COMP%] {\n  margin: var(--space-1) 0;\n}\nsmall[_ngcontent-%COMP%] {\n  color: var(--muted);\n}\n.actions[_ngcontent-%COMP%] {\n  display: flex;\n  flex-direction: column;\n  gap: var(--space-2);\n  align-items: flex-end;\n}"], changeDetection: 0 });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(NotificationItemComponent, [{
    type: Component,
    args: [{ selector: "app-notification-item", changeDetection: ChangeDetectionStrategy.OnPush, imports: [BadgeComponent, ButtonComponent, TypeIconComponent, DatePipe], template: `
    <article class="item" [class.unread]="notification().status === 'UNREAD'">
      <app-type-icon [type]="notification().type" />
      <div class="body">
        <h3>{{ notification().title }}</h3>
        <p>{{ notification().message }}</p>
        <small>
          Tarjeta ****{{ notification().last4 }} \xB7 {{ notification().createdAt | date: 'short' }}
        </small>
      </div>
      <div class="actions">
        <app-badge [tone]="notification().status === 'UNREAD' ? 'info' : 'success'">
          {{ notification().status === 'UNREAD' ? 'Nueva' : 'Le\xEDda' }}
        </app-badge>
        <app-badge tone="warn">{{ typeLabel() }}</app-badge>
        @if (notification().status === 'UNREAD') {
          <app-button (pressed)="markRead.emit(notification().id)">Marcar como le\xEDda</app-button>
        }
      </div>
    </article>
  `, styles: ["/* angular:styles/component:css;ab0ca0b376da98a42767ac538a4bbb458d158febe383b7f385a9717e593844d4;C:/Users/josec/OneDrive/Documentos/prueba_vb6/proyecto vb6/microapp-builder-url/.local/workspaces/stack-d0b46db1-6949-4dda-b534-71a51e3273de/frontend/src/app/notifications/molecules/notification-item.component.ts */\n.item {\n  display: flex;\n  gap: var(--space-4);\n  align-items: flex-start;\n  padding: var(--space-4);\n  background: var(--surface);\n  border: 1px solid var(--border);\n  border-radius: var(--radius-md);\n  box-shadow: var(--shadow-sm);\n}\n.unread {\n  border-inline-start: 4px solid var(--primary);\n}\n.body {\n  flex: 1;\n}\nh3 {\n  margin: 0;\n  font-size: 1rem;\n}\np {\n  margin: var(--space-1) 0;\n}\nsmall {\n  color: var(--muted);\n}\n.actions {\n  display: flex;\n  flex-direction: column;\n  gap: var(--space-2);\n  align-items: flex-end;\n}\n"] }]
  }], null, { notification: [{ type: Input, args: [{ isSignal: true, alias: "notification", required: true }] }], markRead: [{ type: Output, args: ["markRead"] }] });
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(NotificationItemComponent, { className: "NotificationItemComponent", filePath: "src/app/notifications/molecules/notification-item.component.ts", lineNumber: 45 });
})();

export {
  NotificationItemComponent
};
//# sourceMappingURL=chunk-N2AWAW5D.js.map
