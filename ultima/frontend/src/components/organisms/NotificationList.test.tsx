import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import type { AccountNotification } from "../../types/notifications";
import { NotificationList } from "./NotificationList";

const item: AccountNotification = {
  id: "n-1",
  accountId: "acc-001",
  type: "DEBIT",
  title: "Cargo realizado",
  message: "Cargo en ****1234",
  status: "UNREAD",
  createdAt: "2026-01-01T10:00:00Z",
  readAt: null,
};

describe("NotificationList", () => {
  it("given loading state then shows loading status", () => {
    render(<NotificationList items={[]} state="loading" onMarkRead={vi.fn()} />);
    expect(screen.getByRole("status").textContent).toContain("Cargando");
  });

  it("given error state then shows alert", () => {
    render(<NotificationList items={[]} state="error" onMarkRead={vi.fn()} />);
    expect(screen.getByRole("alert")).toBeTruthy();
  });

  it("given success with no items then shows empty message", () => {
    render(<NotificationList items={[]} state="success" onMarkRead={vi.fn()} />);
    expect(screen.getByRole("status").textContent).toContain("No tienes notificaciones");
  });

  it("given success with items then renders each one", () => {
    render(<NotificationList items={[item]} state="success" onMarkRead={vi.fn()} />);
    expect(screen.getAllByRole("listitem")).toHaveLength(1);
    expect(screen.getByText("Cargo realizado")).toBeTruthy();
  });
});
