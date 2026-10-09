import {
  filterPayments,
  formatAmount,
  sortByDateDesc,
  totalCompletedByCurrency
} from "./chunk-BK2EBSJR.js";
import {
  __spreadProps,
  __spreadValues
} from "./chunk-RSTWSNOR.js";

// src/app/domain/payment.queries.spec.ts
import { describe, expect, it } from "vitest";
var base = {
  id: "P1",
  date: "2026-01-01",
  beneficiary: "Caf\xE9 \xD1and\xFA",
  concept: "Compra",
  amount: 10,
  currency: "USD",
  status: "COMPLETED"
};
var data = [
  base,
  __spreadProps(__spreadValues({}, base), { id: "P2", date: "2026-03-01", beneficiary: "Luz Demo", amount: 5.5, status: "PENDING" }),
  __spreadProps(__spreadValues({}, base), { id: "P3", date: "2026-02-01", beneficiary: "Agua Demo", amount: 20, status: "COMPLETED" })
];
describe("payment.queries", () => {
  it("given texto sin tildes when filtra then encuentra beneficiario con tildes", () => {
    const result = filterPayments(data, { text: "cafe nandu", status: "ALL" });
    expect(result.map((p) => p.id)).toEqual(["P1"]);
  });
  it("given estado when filtra then solo devuelve ese estado", () => {
    const result = filterPayments(data, { text: "", status: "PENDING" });
    expect(result.map((p) => p.id)).toEqual(["P2"]);
  });
  it("given filtro sin coincidencias when filtra then lista vac\xEDa", () => {
    expect(filterPayments(data, { text: "zzz", status: "ALL" })).toEqual([]);
  });
  it("given pagos when ordena then m\xE1s reciente primero sin mutar la entrada", () => {
    const sorted = sortByDateDesc(data);
    expect(sorted.map((p) => p.id)).toEqual(["P2", "P3", "P1"]);
    expect(data[0]?.id).toBe("P1");
  });
  it("given pagos when totaliza then suma solo completados por moneda", () => {
    expect(totalCompletedByCurrency(data)).toEqual({ USD: 30 });
  });
  it("given monto when formatea then incluye s\xEDmbolo y decimales", () => {
    expect(formatAmount(1234.5, "USD")).toBe("$1,234.50");
  });
});
//# sourceMappingURL=spec-payment.queries.spec.js.map
