import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import type { NotificationDto } from "../api/types";
import { NotificationItem } from "./NotificationItem";

const unread: NotificationDto = {
  id: "n-1",
  paymentId: "PAY-1",
  type: "PAYMENT_FAILED",
  title: "Pago rechazado",
  message: "Fondos insuficientes",
  amount: 980,
  currency: "USD",
  accountLast4: "1234",
  createdAt: "2026-01-15T10:00:00Z",
  readAt: null,
};

describe("NotificationItem", () => {
  it("given an unread notification, when rendered, then shows title, type and masked account", () => {
    render(<NotificationItem notification={unread} onMarkRead={vi.fn()} />);

    expect(screen.getByText("Pago rechazado")).toBeInTheDocument();
    expect(screen.getByText("Pago fallido")).toBeInTheDocument();
    expect(screen.getByText(/•••• 1234/)).toBeInTheDocument();
  });

  it("given an unread notification, when clicking mark as read, then calls onMarkRead with its id", async () => {
    const onMarkRead = vi.fn();
    render(<NotificationItem notification={unread} onMarkRead={onMarkRead} />);

    await userEvent.click(screen.getByRole("button", { name: /marcar como leída/i }));

    expect(onMarkRead).toHaveBeenCalledTimes(1);
    expect(onMarkRead).toHaveBeenCalledWith("n-1");
  });

  it("given a read notification, when rendered, then has no mark as read button", () => {
    render(<NotificationItem notification={{ ...unread, readAt: "2026-01-15T11:00:00Z" }} onMarkRead={vi.fn()} />);

    expect(screen.queryByRole("button")).not.toBeInTheDocument();
  });
});
