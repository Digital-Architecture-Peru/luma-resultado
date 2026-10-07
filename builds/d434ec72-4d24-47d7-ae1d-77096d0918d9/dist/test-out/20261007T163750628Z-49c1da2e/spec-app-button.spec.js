import {
  AppButton
} from "./chunk-JVHS6TT5.js";
import {
  TestBed,
  provideZonelessChangeDetection
} from "./chunk-JSDFT7HK.js";
import "./chunk-RSTWSNOR.js";

// src/app/atoms/app-button.spec.ts
import { beforeEach, describe, expect, it } from "vitest";
describe("AppButton", () => {
  let fixture;
  beforeEach(async () => {
    TestBed.configureTestingModule({
      imports: [AppButton],
      providers: [provideZonelessChangeDetection()]
    });
    fixture = TestBed.createComponent(AppButton);
    fixture.componentRef.setInput("label", "Confirmar");
    await fixture.whenStable();
  });
  it("given a label then renders it as the accessible name", () => {
    const button = fixture.nativeElement.querySelector("button");
    expect(button.textContent?.trim()).toBe("Confirmar");
  });
  it("given a click then emits pressed once", () => {
    let count = 0;
    fixture.componentInstance.pressed.subscribe(() => count += 1);
    fixture.nativeElement.querySelector("button").click();
    expect(count).toBe(1);
  });
  it("given disabled then the native button is disabled", async () => {
    fixture.componentRef.setInput("disabled", true);
    await fixture.whenStable();
    expect(fixture.nativeElement.querySelector("button").disabled).toBe(true);
  });
});
//# sourceMappingURL=spec-app-button.spec.js.map
