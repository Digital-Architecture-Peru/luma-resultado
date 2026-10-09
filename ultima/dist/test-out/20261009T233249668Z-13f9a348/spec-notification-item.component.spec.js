import {
  NotificationItemComponent
} from "./chunk-N2AWAW5D.js";
import "./chunk-FIVU76E7.js";
import {
  TestBed,
  __spreadProps,
  __spreadValues,
  provideZonelessChangeDetection
} from "./chunk-PUETN2RN.js";

// src/app/notifications/molecules/notification-item.component.spec.ts
import { beforeEach, describe, expect, it } from "vitest";
var unread = {
  id: "n1",
  cardRef: "K1",
  last4: "4242",
  type: "TRANSACTION",
  title: "Compra aprobada",
  message: "Compra por 45.90",
  status: "UNREAD",
  createdAt: "2026-01-15T10:00:00Z",
  readAt: null
};
describe("NotificationItemComponent", () => {
  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [provideZonelessChangeDetection()] });
  });
  function render(n) {
    const fixture = TestBed.createComponent(NotificationItemComponent);
    fixture.componentRef.setInput("notification", n);
    fixture.detectChanges();
    return fixture;
  }
  it("given an unread notification, then shows masked card, title and action button", () => {
    const el = render(unread).nativeElement;
    expect(el.textContent).toContain("Compra aprobada");
    expect(el.textContent).toContain("****4242");
    expect(el.querySelector("button")?.textContent).toContain("Marcar como le\xEDda");
  });
  it("given a read notification, then hides the action button", () => {
    const el = render(__spreadProps(__spreadValues({}, unread), { status: "READ", readAt: "2026-01-16T10:00:00Z" })).nativeElement;
    expect(el.querySelector("button")).toBeNull();
    expect(el.textContent).toContain("Le\xEDda");
  });
  it("when the button is clicked, then emits the notification id", () => {
    const fixture = render(unread);
    const emitted = [];
    fixture.componentInstance.markRead.subscribe((id) => emitted.push(id));
    fixture.nativeElement.querySelector("button")?.click();
    expect(emitted).toEqual(["n1"]);
  });
});
//# sourceMappingURL=spec-notification-item.component.spec.js.map
