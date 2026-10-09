import {
  NotificationItemComponent
} from "./chunk-N2AWAW5D.js";
import "./chunk-FIVU76E7.js";
import {
  ChangeDetectionStrategy,
  Component,
  Input,
  Output,
  TestBed,
  __spreadProps,
  __spreadValues,
  input,
  output,
  provideZonelessChangeDetection,
  setClassMetadata,
  ɵsetClassDebugInfo,
  ɵɵadvance,
  ɵɵconditional,
  ɵɵconditionalCreate,
  ɵɵdefineComponent,
  ɵɵelementEnd,
  ɵɵelementStart,
  ɵɵgetCurrentView,
  ɵɵlistener,
  ɵɵnextContext,
  ɵɵproperty,
  ɵɵrepeater,
  ɵɵrepeaterCreate,
  ɵɵresetView,
  ɵɵrestoreView,
  ɵɵtext,
  ɵɵtextInterpolate
} from "./chunk-PUETN2RN.js";

// src/app/notifications/organisms/notification-list.component.spec.ts
import { beforeEach, describe, expect, it } from "vitest";

// src/app/notifications/organisms/notification-list.component.ts
var _forTrack0 = ($index, $item) => $item.id;
function NotificationListComponent_Conditional_0_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p", 0);
    \u0275\u0275text(1, "Cargando notificaciones\u2026");
    \u0275\u0275elementEnd();
  }
}
function NotificationListComponent_Conditional_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p", 1);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(ctx_r0.error());
  }
}
function NotificationListComponent_Conditional_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p", 0);
    \u0275\u0275text(1, "No tienes notificaciones para esta tarjeta.");
    \u0275\u0275elementEnd();
  }
}
function NotificationListComponent_Conditional_3_For_2_Template(rf, ctx) {
  if (rf & 1) {
    const _r2 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "li")(1, "app-notification-item", 3);
    \u0275\u0275listener("markRead", function NotificationListComponent_Conditional_3_For_2_Template_app_notification_item_markRead_1_listener($event) {
      \u0275\u0275restoreView(_r2);
      const ctx_r0 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r0.markRead.emit($event));
    });
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const item_r3 = ctx.$implicit;
    \u0275\u0275advance();
    \u0275\u0275property("notification", item_r3);
  }
}
function NotificationListComponent_Conditional_3_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "ul", 2);
    \u0275\u0275repeaterCreate(1, NotificationListComponent_Conditional_3_For_2_Template, 2, 1, "li", null, _forTrack0);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275repeater(ctx_r0.items());
  }
}
var NotificationListComponent = class _NotificationListComponent {
  items = input([], ...ngDevMode ? [{ debugName: "items" }] : []);
  loading = input(false, ...ngDevMode ? [{ debugName: "loading" }] : []);
  error = input(null, ...ngDevMode ? [{ debugName: "error" }] : []);
  markRead = output();
  static \u0275fac = function NotificationListComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _NotificationListComponent)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _NotificationListComponent, selectors: [["app-notification-list"]], inputs: { items: [1, "items"], loading: [1, "loading"], error: [1, "error"] }, outputs: { markRead: "markRead" }, decls: 4, vars: 1, consts: [["role", "status"], ["role", "alert"], [1, "list"], [3, "markRead", "notification"]], template: function NotificationListComponent_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275conditionalCreate(0, NotificationListComponent_Conditional_0_Template, 2, 0, "p", 0)(1, NotificationListComponent_Conditional_1_Template, 2, 1, "p", 1)(2, NotificationListComponent_Conditional_2_Template, 2, 0, "p", 0)(3, NotificationListComponent_Conditional_3_Template, 3, 0, "ul", 2);
    }
    if (rf & 2) {
      \u0275\u0275conditional(ctx.loading() ? 0 : ctx.error() ? 1 : ctx.items().length === 0 ? 2 : 3);
    }
  }, dependencies: [NotificationItemComponent], styles: ["\n\n.list[_ngcontent-%COMP%] {\n  list-style: none;\n  margin: 0;\n  padding: 0;\n  display: grid;\n  gap: var(--space-3);\n}"], changeDetection: 0 });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(NotificationListComponent, [{
    type: Component,
    args: [{ selector: "app-notification-list", changeDetection: ChangeDetectionStrategy.OnPush, imports: [NotificationItemComponent], template: `
    @if (loading()) {
      <p role="status">Cargando notificaciones\u2026</p>
    } @else if (error()) {
      <p role="alert">{{ error() }}</p>
    } @else if (items().length === 0) {
      <p role="status">No tienes notificaciones para esta tarjeta.</p>
    } @else {
      <ul class="list">
        @for (item of items(); track item.id) {
          <li><app-notification-item [notification]="item" (markRead)="markRead.emit($event)" /></li>
        }
      </ul>
    }
  `, styles: ["/* angular:styles/component:css;b1f110bce210cf4bd389957921ca6736f524df27603a52459efc361361434d2f;C:/Users/josec/OneDrive/Documentos/prueba_vb6/proyecto vb6/microapp-builder-url/.local/workspaces/stack-d0b46db1-6949-4dda-b534-71a51e3273de/frontend/src/app/notifications/organisms/notification-list.component.ts */\n.list {\n  list-style: none;\n  margin: 0;\n  padding: 0;\n  display: grid;\n  gap: var(--space-3);\n}\n"] }]
  }], null, { items: [{ type: Input, args: [{ isSignal: true, alias: "items", required: false }] }], loading: [{ type: Input, args: [{ isSignal: true, alias: "loading", required: false }] }], error: [{ type: Input, args: [{ isSignal: true, alias: "error", required: false }] }], markRead: [{ type: Output, args: ["markRead"] }] });
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(NotificationListComponent, { className: "NotificationListComponent", filePath: "src/app/notifications/organisms/notification-list.component.ts", lineNumber: 28 });
})();

// src/app/notifications/organisms/notification-list.component.spec.ts
var sample = {
  id: "n1",
  cardRef: "K1",
  last4: "4242",
  type: "PAYMENT_DUE",
  title: "Pago pr\xF3ximo",
  message: "Vence en 3 d\xEDas",
  status: "UNREAD",
  createdAt: "2026-01-15T10:00:00Z",
  readAt: null
};
describe("NotificationListComponent", () => {
  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [provideZonelessChangeDetection()] });
  });
  function render(inputs) {
    const fixture = TestBed.createComponent(NotificationListComponent);
    for (const [key, value] of Object.entries(inputs)) {
      fixture.componentRef.setInput(key, value);
    }
    fixture.detectChanges();
    return fixture.nativeElement;
  }
  it("given loading, then shows a status message", () => {
    expect(render({ loading: true }).querySelector("[role=status]")?.textContent).toContain("Cargando");
  });
  it("given an error, then shows an alert", () => {
    expect(render({ error: "Fall\xF3" }).querySelector("[role=alert]")?.textContent).toContain("Fall\xF3");
  });
  it("given no items, then shows the empty state", () => {
    expect(render({ items: [] }).textContent).toContain("No tienes notificaciones");
  });
  it("given items, then renders one entry per notification", () => {
    const el = render({ items: [sample, __spreadProps(__spreadValues({}, sample), { id: "n2" })] });
    expect(el.querySelectorAll("app-notification-item").length).toBe(2);
  });
});
//# sourceMappingURL=spec-notification-list.component.spec.js.map
