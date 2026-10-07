import {
  TransactionForm
} from "./chunk-3KST47PQ.js";
import "./chunk-3BDUIL3P.js";
import "./chunk-JVHS6TT5.js";
import "./chunk-RUOCWWY3.js";
import {
  TestBed,
  provideZonelessChangeDetection
} from "./chunk-JSDFT7HK.js";
import "./chunk-RSTWSNOR.js";

// src/app/organisms/transaction-form.spec.ts
import { beforeEach, describe, expect, it } from "vitest";
var cards = [
  {
    id: "c1",
    alias: "Visa",
    maskedNumber: "**** 1111",
    currency: "PEN",
    creditLimit: 1e3,
    availableCredit: 800,
    status: "ACTIVE"
  }
];
describe("TransactionForm", () => {
  let fixture;
  let root;
  let emitted;
  async function fill(id, value) {
    const input = root.querySelector(`#${id}`);
    input.value = value;
    input.dispatchEvent(new Event("input"));
    await fixture.whenStable();
  }
  async function submit() {
    root.querySelector("form").dispatchEvent(new Event("submit"));
    await fixture.whenStable();
  }
  beforeEach(async () => {
    TestBed.configureTestingModule({
      imports: [TransactionForm],
      providers: [provideZonelessChangeDetection()]
    });
    fixture = TestBed.createComponent(TransactionForm);
    fixture.componentRef.setInput("cards", cards);
    fixture.componentRef.setInput("selectedCardId", "c1");
    emitted = [];
    fixture.componentInstance.submitted.subscribe((request) => emitted.push(request));
    root = fixture.nativeElement;
    await fixture.whenStable();
  });
  it("given valid data when submitted then emits the request and clears the fields", async () => {
    await fill("amount", "150,50");
    await fill("description", "Supermercado");
    await submit();
    expect(emitted).toEqual([
      { cardId: "c1", type: "PURCHASE", amount: 150.5, description: "Supermercado" }
    ]);
    expect(root.querySelector("#amount").value).toBe("");
    expect(root.querySelector('[role="alert"]')).toBeNull();
  });
  it("given an invalid amount when submitted then shows an alert and does not emit", async () => {
    await fill("amount", "abc");
    await fill("description", "Supermercado");
    await submit();
    expect(emitted).toEqual([]);
    expect(root.querySelector('[role="alert"]')?.textContent).toContain("monto");
  });
  it("given an amount above available credit then rejects locally", async () => {
    await fill("amount", "900");
    await fill("description", "Electrodom\xE9stico");
    await submit();
    expect(emitted).toEqual([]);
    expect(root.querySelector('[role="alert"]')?.textContent).toContain("cr\xE9dito disponible");
  });
  it("given busy then the submit button is disabled", async () => {
    fixture.componentRef.setInput("busy", true);
    await fixture.whenStable();
    expect(root.querySelector("button").disabled).toBe(true);
  });
});
//# sourceMappingURL=spec-transaction-form.spec.js.map
