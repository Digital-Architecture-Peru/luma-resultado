import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import type { NotificationDto } from "../api/types";
import { NotificationBell } from "./NotificationBell";

const item: NotificationDto = {
  id: "n-1",
  paymentId: "PAY-1",
  type: "PAYMENT_SUCCEEDED",
  title: "Pago realizado",
  message: "Procesado correctamente",
  amount: 125.5,
  currency: "USD",
  accountLast4: "1234",
  createdAt: "2026-01-15T10:00:00Z",
  readAt: null,
};

describe("NotificationBell", () => {
  it("given unread notifications, when rendered, then the accessible name includes the count", () => {
    render(<NotificationBell items={[item]} unreadCount={1} status="success" onMarkRead={vi.fn()} />);

    expect(screen.getByRole("button", { name: "Notificaciones, 1 sin leer" })).toBeInTheDocument();
    expect(screen.queryByText("Pago realizado")).not.toBeInTheDocument();
  });

  it("given the panel is closed, when clicking the bell, then lists the notifications", async () => {
    render(<NotificationBell items={[item]} unreadCount={1} status="success" onMarkRead={vi.fn()} />);

    await userEvent.click(screen.getByRole("button", { name: /Notificaciones/ }));

    expect(screen.getByText("Pago realizado")).toBeInTheDocument();
  });

  it("given an open panel, when clicking mark as read, then calls onMarkRead", async () => {
    const onMarkRead = vi.fn();
    render(<NotificationBell items={[item]} unreadCount={1} status="success" onMarkRead={onMarkRead} />);

    await userEvent.click(screen.getByRole("button", { name: /Notificaciones/ }));
    await userEvent.click(screen.getByRole("button", { name: /marcar como leída/i }));

    expect(onMarkRead).toHaveBeenCalledWith("n-1");
  });

  it("given no notifications, when opened, then shows the empty state", async () => {
    render(<NotificationBell items={[]} unreadCount={0} status="success" onMarkRead={vi.fn()} />);

    await userEvent.click(screen.getByRole("button", { name: "Notificaciones" }));

    expect(screen.getByRole("status")).toHaveTextContent("No tienes notificaciones nuevas.");
  });

  it("given an error status, when opened, then shows an alert", async () => {
    render(<NotificationBell items={[]} unreadCount={0} status="error" onMarkRead={vi.fn()} />);

    await userEvent.click(screen.getByRole("button", { name: "Notificaciones" }));

    expect(screen.getByRole("alert")).toBeInTheDocument();
  });
});
