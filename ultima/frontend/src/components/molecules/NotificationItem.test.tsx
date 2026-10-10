import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import type { AccountNotification } from "../../types/notifications";
import { NotificationItem } from "./NotificationItem";

const base: AccountNotification = {
  id: "n-1",
  accountId: "acc-001",
  type: "CREDIT",
  title: "Abono recibido",
  message: "Abono a la cuenta ****1234",
  status: "UNREAD",
  createdAt: "2026-01-01T10:00:00Z",
  readAt: null,
};

describe("NotificationItem", () => {
  it("given unread notification when clicking the button then calls onMarkRead with id", () => {
    const onMarkRead = vi.fn();
    render(<NotificationItem notification={base} onMarkRead={onMarkRead} />);

    fireEvent.click(screen.getByRole("button", { name: "Marcar como leída" }));

    expect(onMarkRead).toHaveBeenCalledWith("n-1");
  });

  it("given read notification when rendered then shows no action button", () => {
    render(<NotificationItem notification={{ ...base, status: "READ" }} onMarkRead={vi.fn()} />);

    expect(screen.queryByRole("button")).toBeNull();
    expect(screen.getByText("Leída")).toBeTruthy();
  });
});
