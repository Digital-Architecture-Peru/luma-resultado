import {
  StatusBadgeComponent
} from "./chunk-V2W5D2RK.js";
import {
  TestBed,
  provideZonelessChangeDetection
} from "./chunk-W5AVGSS5.js";
import "./chunk-RSTWSNOR.js";

// src/app/atoms/status-badge.component.spec.ts
import { beforeEach, describe, expect, it } from "vitest";
describe("StatusBadgeComponent", () => {
  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [provideZonelessChangeDetection()] });
  });
  it("given estado REJECTED when renderiza then muestra texto y clase", async () => {
    const fixture = TestBed.createComponent(StatusBadgeComponent);
    fixture.componentRef.setInput("status", "REJECTED");
    await fixture.whenStable();
    const span = fixture.nativeElement.querySelector("span");
    expect(span?.textContent).toContain("Rechazado");
    expect(span?.classList.contains("badge-rejected")).toBe(true);
  });
});
//# sourceMappingURL=spec-status-badge.component.spec.js.map
