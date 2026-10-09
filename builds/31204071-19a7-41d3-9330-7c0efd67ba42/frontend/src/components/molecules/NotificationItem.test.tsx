import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import type { CardNotification } from "../../api/types";
import { NotificationItem } from "./NotificationItem";

function sample(overrides: Partial<CardNotification> = {}): CardNotification {
  return {
    id: "n-1",
    cardId: "c-1",
    cardLast4: "4242",
    type: "PURCHASE",
    title: "Compra aprobada",
    message: "Compra en COMERCIO DEMO.",
    amount: 150,
    currency: "PEN",
    read: false,
    readAt: null,
    createdAt: "2026-10-09T10:00:00Z",
    ...overrides,
  };
}

describe("NotificationItem", () => {
  it("given an unread notification when rendered then shows title, amount and unread state", () => {
    render(<NotificationItem notification={sample()} onMarkRead={() => {}} />);

    expect(screen.getByRole("heading", { name: "Compra aprobada" })).toBeInTheDocument();
    expect(screen.getByText("No leída")).toBeInTheDocument();
    expect(screen.getByText(/150[.,]00/)).toBeInTheDocument();
  });

  it("given an unread notification when marking as read then calls the handler with its id", async () => {
    const onMarkRead = vi.fn();
    render(<NotificationItem notification={sample()} onMarkRead={onMarkRead} />);

    await userEvent.setup().click(screen.getByRole("button", { name: "Marcar como leída" }));

    expect(onMarkRead).toHaveBeenCalledWith("n-1");
  });

  it("given a read notification when rendered then offers no mark-as-read action", () => {
    render(
      <NotificationItem
        notification={sample({ read: true, readAt: "2026-10-09T11:00:00Z" })}
        onMarkRead={() => {}}
      />,
    );

    expect(screen.queryByRole("button", { name: "Marcar como leída" })).not.toBeInTheDocument();
    expect(screen.queryByText("No leída")).not.toBeInTheDocument();
  });

  it("given a notification without amount when rendered then omits the amount", () => {
    render(<NotificationItem notification={sample({ amount: null })} onMarkRead={() => {}} />);

    expect(screen.queryByText(/S\//)).not.toBeInTheDocument();
  });
});
