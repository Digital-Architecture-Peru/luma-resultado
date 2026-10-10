import {
  Component,
  Input,
  TestBed,
  computed,
  input,
  setClassMetadata,
  ɵsetClassDebugInfo,
  ɵɵadvance,
  ɵɵdefineComponent,
  ɵɵdomElementEnd,
  ɵɵdomElementStart,
  ɵɵstyleProp,
  ɵɵtext,
  ɵɵtextInterpolate
} from "./chunk-D3SDVBBA.js";

// src/app/pagos/atoms/etiqueta-estado.component.spec.ts
import { describe, expect, it } from "vitest";

// src/app/pagos/atoms/etiqueta-estado.component.ts
var TEXTOS = {
  PENDIENTE: "Pendiente",
  CONFIRMADO: "Confirmado",
  RECHAZADO: "Rechazado"
};
var COLORES = {
  PENDIENTE: "var(--warning)",
  CONFIRMADO: "var(--success)",
  RECHAZADO: "var(--danger)"
};
var EtiquetaEstadoComponent = class _EtiquetaEstadoComponent {
  estado = input.required(...ngDevMode ? [{ debugName: "estado" }] : []);
  texto = computed(() => TEXTOS[this.estado()], ...ngDevMode ? [{ debugName: "texto" }] : []);
  color = computed(() => COLORES[this.estado()], ...ngDevMode ? [{ debugName: "color" }] : []);
  static \u0275fac = function EtiquetaEstadoComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _EtiquetaEstadoComponent)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _EtiquetaEstadoComponent, selectors: [["app-etiqueta-estado"]], inputs: { estado: [1, "estado"] }, decls: 2, vars: 3, consts: [[1, "badge"]], template: function EtiquetaEstadoComponent_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275domElementStart(0, "span", 0);
      \u0275\u0275text(1);
      \u0275\u0275domElementEnd();
    }
    if (rf & 2) {
      \u0275\u0275styleProp("color", ctx.color());
      \u0275\u0275advance();
      \u0275\u0275textInterpolate(ctx.texto());
    }
  }, styles: ["\n\n.badge[_ngcontent-%COMP%] {\n  display: inline-block;\n  padding: 0.125rem 0.625rem;\n  border: 1px solid currentColor;\n  border-radius: 999px;\n  font-weight: 600;\n  font-size: 0.875rem;\n}"] });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(EtiquetaEstadoComponent, [{
    type: Component,
    args: [{ selector: "app-etiqueta-estado", template: `<span class="badge" [style.color]="color()">{{ texto() }}</span>`, styles: ["/* angular:styles/component:css;06eb137b6d86b86170f739ae416652a78898a70f51187bcbb7f4d6c3d5eec5a9;C:/Users/josec/OneDrive/Documentos/prueba_vb6/proyecto vb6/microapp-builder-url/.local/workspaces/stack-b5ef561c-82ea-412c-a37e-512b3e005a89/frontend/src/app/pagos/atoms/etiqueta-estado.component.ts */\n.badge {\n  display: inline-block;\n  padding: 0.125rem 0.625rem;\n  border: 1px solid currentColor;\n  border-radius: 999px;\n  font-weight: 600;\n  font-size: 0.875rem;\n}\n"] }]
  }], null, { estado: [{ type: Input, args: [{ isSignal: true, alias: "estado", required: true }] }] });
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(EtiquetaEstadoComponent, { className: "EtiquetaEstadoComponent", filePath: "src/app/pagos/atoms/etiqueta-estado.component.ts", lineNumber: 22 });
})();

// src/app/pagos/atoms/etiqueta-estado.component.spec.ts
describe("EtiquetaEstadoComponent", () => {
  const casos = [
    ["PENDIENTE", "Pendiente"],
    ["CONFIRMADO", "Confirmado"],
    ["RECHAZADO", "Rechazado"]
  ];
  it.each(casos)("given estado %s, when se renderiza, then muestra el texto %s", (estado, texto) => {
    const fixture = TestBed.createComponent(EtiquetaEstadoComponent);
    fixture.componentRef.setInput("estado", estado);
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent?.trim()).toBe(texto);
  });
});
//# sourceMappingURL=spec-etiqueta-estado.component.spec.js.map
