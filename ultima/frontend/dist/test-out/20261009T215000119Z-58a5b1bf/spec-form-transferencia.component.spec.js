import {
  DecimalPipe
} from "./chunk-ZSSH2R4N.js";
import {
  ChangeDetectionStrategy,
  Component,
  Input,
  Output,
  TestBed,
  computed,
  input,
  output,
  provideZonelessChangeDetection,
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
  ɵɵdomListener,
  ɵɵdomProperty,
  ɵɵelementEnd,
  ɵɵelementStart,
  ɵɵlistener,
  ɵɵnextContext,
  ɵɵpipe,
  ɵɵpipeBind2,
  ɵɵprojection,
  ɵɵprojectionDef,
  ɵɵproperty,
  ɵɵrepeater,
  ɵɵrepeaterCreate,
  ɵɵtext,
  ɵɵtextInterpolate,
  ɵɵtextInterpolate1,
  ɵɵtextInterpolate3
} from "./chunk-IGBUOUJX.js";

// src/app/shared/ui/organisms/form-transferencia.component.spec.ts
import { beforeEach, describe, expect, it } from "vitest";

// src/app/shared/ui/atoms/boton.component.ts
var _c0 = ["*"];
var BotonComponent = class _BotonComponent {
  tipo = input("button", ...ngDevMode ? [{ debugName: "tipo" }] : []);
  deshabilitado = input(false, ...ngDevMode ? [{ debugName: "deshabilitado" }] : []);
  static \u0275fac = function BotonComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _BotonComponent)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _BotonComponent, selectors: [["app-boton"]], inputs: { tipo: [1, "tipo"], deshabilitado: [1, "deshabilitado"] }, ngContentSelectors: _c0, decls: 2, vars: 2, consts: [[1, "btn", 3, "type", "disabled"]], template: function BotonComponent_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275projectionDef();
      \u0275\u0275domElementStart(0, "button", 0);
      \u0275\u0275projection(1);
      \u0275\u0275domElementEnd();
    }
    if (rf & 2) {
      \u0275\u0275domProperty("type", ctx.tipo())("disabled", ctx.deshabilitado());
    }
  }, encapsulation: 2, changeDetection: 0 });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(BotonComponent, [{
    type: Component,
    args: [{
      selector: "app-boton",
      changeDetection: ChangeDetectionStrategy.OnPush,
      template: `<button class="btn" [type]="tipo()" [disabled]="deshabilitado()"><ng-content /></button>`
    }]
  }], null, { tipo: [{ type: Input, args: [{ isSignal: true, alias: "tipo", required: false }] }], deshabilitado: [{ type: Input, args: [{ isSignal: true, alias: "deshabilitado", required: false }] }] });
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(BotonComponent, { className: "BotonComponent", filePath: "src/app/shared/ui/atoms/boton.component.ts", lineNumber: 9 });
})();

// src/app/shared/ui/atoms/input-monto.component.ts
function InputMontoComponent_Conditional_3_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275domElementStart(0, "p", 2);
    \u0275\u0275text(1);
    \u0275\u0275domElementEnd();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275domProperty("id", ctx_r0.campoId() + "-error");
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(ctx_r0.error());
  }
}
var InputMontoComponent = class _InputMontoComponent {
  campoId = input("monto", ...ngDevMode ? [{ debugName: "campoId" }] : []);
  etiqueta = input("Monto", ...ngDevMode ? [{ debugName: "etiqueta" }] : []);
  valor = input("", ...ngDevMode ? [{ debugName: "valor" }] : []);
  error = input(null, ...ngDevMode ? [{ debugName: "error" }] : []);
  valorChange = output();
  static \u0275fac = function InputMontoComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _InputMontoComponent)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _InputMontoComponent, selectors: [["app-input-monto"]], inputs: { campoId: [1, "campoId"], etiqueta: [1, "etiqueta"], valor: [1, "valor"], error: [1, "error"] }, outputs: { valorChange: "valorChange" }, decls: 4, vars: 7, consts: [[1, "campo__etiqueta", 3, "for"], ["type", "text", "inputmode", "decimal", "autocomplete", "off", 1, "campo__control", 3, "input", "id", "value"], [1, "campo__error", 3, "id"]], template: function InputMontoComponent_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275domElementStart(0, "label", 0);
      \u0275\u0275text(1);
      \u0275\u0275domElementEnd();
      \u0275\u0275domElementStart(2, "input", 1);
      \u0275\u0275domListener("input", function InputMontoComponent_Template_input_input_2_listener($event) {
        return ctx.valorChange.emit($event.target.value);
      });
      \u0275\u0275domElementEnd();
      \u0275\u0275conditionalCreate(3, InputMontoComponent_Conditional_3_Template, 2, 2, "p", 2);
    }
    if (rf & 2) {
      \u0275\u0275domProperty("htmlFor", ctx.campoId());
      \u0275\u0275advance();
      \u0275\u0275textInterpolate(ctx.etiqueta());
      \u0275\u0275advance();
      \u0275\u0275domProperty("id", ctx.campoId())("value", ctx.valor());
      \u0275\u0275attribute("aria-invalid", ctx.error() ? "true" : null)("aria-describedby", ctx.error() ? ctx.campoId() + "-error" : null);
      \u0275\u0275advance();
      \u0275\u0275conditional(ctx.error() ? 3 : -1);
    }
  }, encapsulation: 2, changeDetection: 0 });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(InputMontoComponent, [{
    type: Component,
    args: [{
      selector: "app-input-monto",
      changeDetection: ChangeDetectionStrategy.OnPush,
      template: `
    <label class="campo__etiqueta" [for]="campoId()">{{ etiqueta() }}</label>
    <input
      class="campo__control"
      type="text"
      inputmode="decimal"
      autocomplete="off"
      [id]="campoId()"
      [value]="valor()"
      [attr.aria-invalid]="error() ? 'true' : null"
      [attr.aria-describedby]="error() ? campoId() + '-error' : null"
      (input)="valorChange.emit($any($event.target).value)"
    />
    @if (error()) {
      <p class="campo__error" [id]="campoId() + '-error'">{{ error() }}</p>
    }
  `
    }]
  }], null, { campoId: [{ type: Input, args: [{ isSignal: true, alias: "campoId", required: false }] }], etiqueta: [{ type: Input, args: [{ isSignal: true, alias: "etiqueta", required: false }] }], valor: [{ type: Input, args: [{ isSignal: true, alias: "valor", required: false }] }], error: [{ type: Input, args: [{ isSignal: true, alias: "error", required: false }] }], valorChange: [{ type: Output, args: ["valorChange"] }] });
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(InputMontoComponent, { className: "InputMontoComponent", filePath: "src/app/shared/ui/atoms/input-monto.component.ts", lineNumber: 25 });
})();

// src/app/shared/ui/molecules/selector-cuenta.component.ts
var _forTrack0 = ($index, $item) => $item.id;
function SelectorCuentaComponent_For_6_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275domElementStart(0, "option", 3);
    \u0275\u0275text(1);
    \u0275\u0275pipe(2, "number");
    \u0275\u0275domElementEnd();
  }
  if (rf & 2) {
    const c_r1 = ctx.$implicit;
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275domProperty("value", c_r1.id)("selected", c_r1.id === ctx_r1.valor());
    \u0275\u0275advance();
    \u0275\u0275textInterpolate3(" ", c_r1.numeroEnmascarado, " \xB7 ", \u0275\u0275pipeBind2(2, 5, c_r1.saldo, "1.2-2"), " ", c_r1.moneda, " ");
  }
}
function SelectorCuentaComponent_Conditional_7_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275domElementStart(0, "p", 4);
    \u0275\u0275text(1);
    \u0275\u0275domElementEnd();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275domProperty("id", ctx_r1.campoId() + "-error");
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(ctx_r1.error());
  }
}
var SelectorCuentaComponent = class _SelectorCuentaComponent {
  campoId = input.required(...ngDevMode ? [{ debugName: "campoId" }] : []);
  etiqueta = input.required(...ngDevMode ? [{ debugName: "etiqueta" }] : []);
  cuentas = input([], ...ngDevMode ? [{ debugName: "cuentas" }] : []);
  valor = input("", ...ngDevMode ? [{ debugName: "valor" }] : []);
  error = input(null, ...ngDevMode ? [{ debugName: "error" }] : []);
  seleccionada = output();
  static \u0275fac = function SelectorCuentaComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _SelectorCuentaComponent)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _SelectorCuentaComponent, selectors: [["app-selector-cuenta"]], inputs: { campoId: [1, "campoId"], etiqueta: [1, "etiqueta"], cuentas: [1, "cuentas"], valor: [1, "valor"], error: [1, "error"] }, outputs: { seleccionada: "seleccionada" }, decls: 8, vars: 7, consts: [[1, "campo__etiqueta", 3, "for"], [1, "campo__control", 3, "change", "id"], ["value", "", 3, "selected"], [3, "value", "selected"], [1, "campo__error", 3, "id"]], template: function SelectorCuentaComponent_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275domElementStart(0, "label", 0);
      \u0275\u0275text(1);
      \u0275\u0275domElementEnd();
      \u0275\u0275domElementStart(2, "select", 1);
      \u0275\u0275domListener("change", function SelectorCuentaComponent_Template_select_change_2_listener($event) {
        return ctx.seleccionada.emit($event.target.value);
      });
      \u0275\u0275domElementStart(3, "option", 2);
      \u0275\u0275text(4, "Seleccione una cuenta");
      \u0275\u0275domElementEnd();
      \u0275\u0275repeaterCreate(5, SelectorCuentaComponent_For_6_Template, 3, 8, "option", 3, _forTrack0);
      \u0275\u0275domElementEnd();
      \u0275\u0275conditionalCreate(7, SelectorCuentaComponent_Conditional_7_Template, 2, 2, "p", 4);
    }
    if (rf & 2) {
      \u0275\u0275domProperty("htmlFor", ctx.campoId());
      \u0275\u0275advance();
      \u0275\u0275textInterpolate(ctx.etiqueta());
      \u0275\u0275advance();
      \u0275\u0275domProperty("id", ctx.campoId());
      \u0275\u0275attribute("aria-invalid", ctx.error() ? "true" : null)("aria-describedby", ctx.error() ? ctx.campoId() + "-error" : null);
      \u0275\u0275advance();
      \u0275\u0275domProperty("selected", !ctx.valor());
      \u0275\u0275advance(2);
      \u0275\u0275repeater(ctx.cuentas());
      \u0275\u0275advance(2);
      \u0275\u0275conditional(ctx.error() ? 7 : -1);
    }
  }, dependencies: [DecimalPipe], encapsulation: 2, changeDetection: 0 });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(SelectorCuentaComponent, [{
    type: Component,
    args: [{
      selector: "app-selector-cuenta",
      imports: [DecimalPipe],
      changeDetection: ChangeDetectionStrategy.OnPush,
      template: `
    <label class="campo__etiqueta" [for]="campoId()">{{ etiqueta() }}</label>
    <select
      class="campo__control"
      [id]="campoId()"
      [attr.aria-invalid]="error() ? 'true' : null"
      [attr.aria-describedby]="error() ? campoId() + '-error' : null"
      (change)="seleccionada.emit($any($event.target).value)"
    >
      <option value="" [selected]="!valor()">Seleccione una cuenta</option>
      @for (c of cuentas(); track c.id) {
        <option [value]="c.id" [selected]="c.id === valor()">
          {{ c.numeroEnmascarado }} \xB7 {{ c.saldo | number: '1.2-2' }} {{ c.moneda }}
        </option>
      }
    </select>
    @if (error()) {
      <p class="campo__error" [id]="campoId() + '-error'">{{ error() }}</p>
    }
  `
    }]
  }], null, { campoId: [{ type: Input, args: [{ isSignal: true, alias: "campoId", required: true }] }], etiqueta: [{ type: Input, args: [{ isSignal: true, alias: "etiqueta", required: true }] }], cuentas: [{ type: Input, args: [{ isSignal: true, alias: "cuentas", required: false }] }], valor: [{ type: Input, args: [{ isSignal: true, alias: "valor", required: false }] }], error: [{ type: Input, args: [{ isSignal: true, alias: "error", required: false }] }], seleccionada: [{ type: Output, args: ["seleccionada"] }] });
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(SelectorCuentaComponent, { className: "SelectorCuentaComponent", filePath: "src/app/shared/ui/molecules/selector-cuenta.component.ts", lineNumber: 31 });
})();

// src/app/shared/ui/organisms/form-transferencia.component.ts
function FormTransferenciaComponent_Conditional_8_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p", 7);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(ctx_r0.errorServidor());
  }
}
var FORMATO_MONTO = /^\d+(\.\d{1,2})?$/;
var MAX_CONCEPTO = 140;
var FormTransferenciaComponent = class _FormTransferenciaComponent {
  cuentas = input([], ...ngDevMode ? [{ debugName: "cuentas" }] : []);
  enviando = input(false, ...ngDevMode ? [{ debugName: "enviando" }] : []);
  errorServidor = input(null, ...ngDevMode ? [{ debugName: "errorServidor" }] : []);
  enviar = output();
  maxConcepto = MAX_CONCEPTO;
  origenId = signal("", ...ngDevMode ? [{ debugName: "origenId" }] : []);
  destinoId = signal("", ...ngDevMode ? [{ debugName: "destinoId" }] : []);
  monto = signal("", ...ngDevMode ? [{ debugName: "monto" }] : []);
  concepto = signal("", ...ngDevMode ? [{ debugName: "concepto" }] : []);
  intentado = signal(false, ...ngDevMode ? [{ debugName: "intentado" }] : []);
  origen = computed(() => this.cuentas().find((c) => c.id === this.origenId()), ...ngDevMode ? [{ debugName: "origen" }] : []);
  destino = computed(() => this.cuentas().find((c) => c.id === this.destinoId()), ...ngDevMode ? [{ debugName: "destino" }] : []);
  montoValido = computed(() => {
    const texto = this.monto().trim();
    return FORMATO_MONTO.test(texto) && Number(texto) > 0;
  }, ...ngDevMode ? [{ debugName: "montoValido" }] : []);
  errorOrigen = computed(() => this.intentado() && !this.origenId() ? "Seleccione la cuenta de origen." : null, ...ngDevMode ? [{ debugName: "errorOrigen" }] : []);
  errorDestino = computed(() => {
    if (!this.intentado())
      return null;
    if (!this.destinoId())
      return "Seleccione la cuenta de destino.";
    if (this.destinoId() === this.origenId())
      return "El destino debe ser distinto del origen.";
    const origen = this.origen();
    const destino = this.destino();
    if (origen && destino && destino.moneda !== origen.moneda) {
      return "Las cuentas deben tener la misma moneda.";
    }
    return null;
  }, ...ngDevMode ? [{ debugName: "errorDestino" }] : []);
  errorMonto = computed(() => {
    if (!this.intentado())
      return null;
    if (!this.montoValido())
      return "Ingrese un monto mayor que cero con m\xE1ximo 2 decimales.";
    const origen = this.origen();
    if (origen && Number(this.monto()) > origen.saldo)
      return "El monto supera el saldo disponible.";
    return null;
  }, ...ngDevMode ? [{ debugName: "errorMonto" }] : []);
  valido = computed(() => {
    const origen = this.origen();
    const destino = this.destino();
    return !!origen && !!destino && origen.id !== destino.id && origen.moneda === destino.moneda && this.montoValido() && Number(this.monto()) <= origen.saldo;
  }, ...ngDevMode ? [{ debugName: "valido" }] : []);
  onSubmit(evento) {
    evento.preventDefault();
    this.intentado.set(true);
    const origen = this.origen();
    if (!this.valido() || !origen)
      return;
    this.enviar.emit({
      origenId: origen.id,
      destinoId: this.destinoId(),
      monto: Number(this.monto().trim()),
      moneda: origen.moneda,
      concepto: this.concepto().trim()
    });
  }
  static \u0275fac = function FormTransferenciaComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _FormTransferenciaComponent)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _FormTransferenciaComponent, selectors: [["app-form-transferencia"]], inputs: { cuentas: [1, "cuentas"], enviando: [1, "enviando"], errorServidor: [1, "errorServidor"] }, outputs: { enviar: "enviar" }, decls: 11, vars: 13, consts: [["novalidate", "", "aria-label", "Transferencia entre cuentas propias", 1, "card", 3, "submit"], ["campoId", "origen", "etiqueta", "Cuenta de origen", 3, "seleccionada", "cuentas", "valor", "error"], ["campoId", "destino", "etiqueta", "Cuenta de destino", 3, "seleccionada", "cuentas", "valor", "error"], ["campoId", "monto", "etiqueta", "Monto", 3, "valorChange", "valor", "error"], [1, "campo"], ["for", "concepto", 1, "campo__etiqueta"], ["id", "concepto", "type", "text", 1, "campo__control", 3, "input", "maxLength", "value"], ["role", "alert", 1, "campo__error"], ["tipo", "submit", 3, "deshabilitado"]], template: function FormTransferenciaComponent_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275elementStart(0, "form", 0);
      \u0275\u0275listener("submit", function FormTransferenciaComponent_Template_form_submit_0_listener($event) {
        return ctx.onSubmit($event);
      });
      \u0275\u0275elementStart(1, "app-selector-cuenta", 1);
      \u0275\u0275listener("seleccionada", function FormTransferenciaComponent_Template_app_selector_cuenta_seleccionada_1_listener($event) {
        return ctx.origenId.set($event);
      });
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(2, "app-selector-cuenta", 2);
      \u0275\u0275listener("seleccionada", function FormTransferenciaComponent_Template_app_selector_cuenta_seleccionada_2_listener($event) {
        return ctx.destinoId.set($event);
      });
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(3, "app-input-monto", 3);
      \u0275\u0275listener("valorChange", function FormTransferenciaComponent_Template_app_input_monto_valorChange_3_listener($event) {
        return ctx.monto.set($event);
      });
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(4, "div", 4)(5, "label", 5);
      \u0275\u0275text(6, "Concepto (opcional)");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(7, "input", 6);
      \u0275\u0275listener("input", function FormTransferenciaComponent_Template_input_input_7_listener($event) {
        return ctx.concepto.set($event.target.value);
      });
      \u0275\u0275elementEnd()();
      \u0275\u0275conditionalCreate(8, FormTransferenciaComponent_Conditional_8_Template, 2, 1, "p", 7);
      \u0275\u0275elementStart(9, "app-boton", 8);
      \u0275\u0275text(10);
      \u0275\u0275elementEnd()();
    }
    if (rf & 2) {
      \u0275\u0275advance();
      \u0275\u0275property("cuentas", ctx.cuentas())("valor", ctx.origenId())("error", ctx.errorOrigen());
      \u0275\u0275advance();
      \u0275\u0275property("cuentas", ctx.cuentas())("valor", ctx.destinoId())("error", ctx.errorDestino());
      \u0275\u0275advance();
      \u0275\u0275property("valor", ctx.monto())("error", ctx.errorMonto());
      \u0275\u0275advance(4);
      \u0275\u0275property("maxLength", ctx.maxConcepto)("value", ctx.concepto());
      \u0275\u0275advance();
      \u0275\u0275conditional(ctx.errorServidor() ? 8 : -1);
      \u0275\u0275advance();
      \u0275\u0275property("deshabilitado", ctx.enviando());
      \u0275\u0275advance();
      \u0275\u0275textInterpolate1(" ", ctx.enviando() ? "Enviando\u2026" : "Transferir", " ");
    }
  }, dependencies: [BotonComponent, InputMontoComponent, SelectorCuentaComponent], encapsulation: 2, changeDetection: 0 });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(FormTransferenciaComponent, [{
    type: Component,
    args: [{
      selector: "app-form-transferencia",
      imports: [BotonComponent, InputMontoComponent, SelectorCuentaComponent],
      changeDetection: ChangeDetectionStrategy.OnPush,
      template: `
    <form class="card" novalidate aria-label="Transferencia entre cuentas propias" (submit)="onSubmit($event)">
      <app-selector-cuenta
        campoId="origen" etiqueta="Cuenta de origen" [cuentas]="cuentas()"
        [valor]="origenId()" [error]="errorOrigen()" (seleccionada)="origenId.set($event)" />
      <app-selector-cuenta
        campoId="destino" etiqueta="Cuenta de destino" [cuentas]="cuentas()"
        [valor]="destinoId()" [error]="errorDestino()" (seleccionada)="destinoId.set($event)" />
      <app-input-monto
        campoId="monto" etiqueta="Monto" [valor]="monto()" [error]="errorMonto()"
        (valorChange)="monto.set($event)" />
      <div class="campo">
        <label class="campo__etiqueta" for="concepto">Concepto (opcional)</label>
        <input class="campo__control" id="concepto" type="text" [maxLength]="maxConcepto"
          [value]="concepto()" (input)="concepto.set($any($event.target).value)" />
      </div>
      @if (errorServidor()) {
        <p class="campo__error" role="alert">{{ errorServidor() }}</p>
      }
      <app-boton tipo="submit" [deshabilitado]="enviando()">
        {{ enviando() ? 'Enviando\u2026' : 'Transferir' }}
      </app-boton>
    </form>
  `
    }]
  }], null, { cuentas: [{ type: Input, args: [{ isSignal: true, alias: "cuentas", required: false }] }], enviando: [{ type: Input, args: [{ isSignal: true, alias: "enviando", required: false }] }], errorServidor: [{ type: Input, args: [{ isSignal: true, alias: "errorServidor", required: false }] }], enviar: [{ type: Output, args: ["enviar"] }] });
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(FormTransferenciaComponent, { className: "FormTransferenciaComponent", filePath: "src/app/shared/ui/organisms/form-transferencia.component.ts", lineNumber: 40 });
})();

// src/app/shared/ui/organisms/form-transferencia.component.spec.ts
var CUENTAS = [
  { id: "a", numeroEnmascarado: "****-0001", moneda: "USD", saldo: 100 },
  { id: "b", numeroEnmascarado: "****-0002", moneda: "USD", saldo: 5 }
];
describe("FormTransferenciaComponent", () => {
  let fixture;
  let componente;
  let emitidas;
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormTransferenciaComponent],
      providers: [provideZonelessChangeDetection()]
    }).compileComponents();
    fixture = TestBed.createComponent(FormTransferenciaComponent);
    componente = fixture.componentInstance;
    fixture.componentRef.setInput("cuentas", CUENTAS);
    emitidas = [];
    componente.enviar.subscribe((s) => emitidas.push(s));
    fixture.detectChanges();
  });
  const enviarFormulario = async () => {
    const form = fixture.nativeElement.querySelector("form");
    form.dispatchEvent(new Event("submit", { cancelable: true }));
    await fixture.whenStable();
    fixture.detectChanges();
  };
  it("given sin monto, then el formulario es inv\xE1lido y no emite", async () => {
    componente.origenId.set("a");
    componente.destinoId.set("b");
    expect(componente.valido()).toBe(false);
    await enviarFormulario();
    expect(emitidas).toHaveLength(0);
    expect(fixture.nativeElement.textContent).toContain("Ingrese un monto mayor que cero");
  });
  it("given monto superior al saldo, then es inv\xE1lido", () => {
    componente.origenId.set("a");
    componente.destinoId.set("b");
    componente.monto.set("100.01");
    expect(componente.valido()).toBe(false);
  });
  it("given origen igual a destino, then es inv\xE1lido", () => {
    componente.origenId.set("a");
    componente.destinoId.set("a");
    componente.monto.set("10");
    expect(componente.valido()).toBe(false);
  });
  it("given datos v\xE1lidos, when se env\xEDa, then emite la solicitud con la moneda del origen", async () => {
    componente.origenId.set("a");
    componente.destinoId.set("b");
    componente.monto.set("25.50");
    componente.concepto.set(" alquiler ");
    await enviarFormulario();
    expect(emitidas).toEqual([
      { origenId: "a", destinoId: "b", monto: 25.5, moneda: "USD", concepto: "alquiler" }
    ]);
  });
});
//# sourceMappingURL=spec-form-transferencia.component.spec.js.map
