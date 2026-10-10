import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import type { Preference } from "../../types/notifications";
import { PreferencesForm } from "./PreferencesForm";

const prefs: Preference[] = [
  { type: "CREDIT", channel: "IN_APP", enabled: true, thresholdAmount: null },
  { type: "LOW_BALANCE", channel: "IN_APP", enabled: true, thresholdAmount: 100 },
];

describe("PreferencesForm", () => {
  it("given a toggled preference when saving then onSave receives the updated list", () => {
    const onSave = vi.fn();
    render(<PreferencesForm preferences={prefs} state="success" saved={false} onSave={onSave} />);

    fireEvent.click(screen.getByRole("switch", { name: "Abonos" }));
    fireEvent.click(screen.getByRole("button", { name: "Guardar preferencias" }));

    expect(onSave).toHaveBeenCalledTimes(1);
    const sent = onSave.mock.calls[0][0] as Preference[];
    expect(sent[0].enabled).toBe(false);
    expect(sent[1].enabled).toBe(true);
  });

  it("given a changed threshold when saving then sends the numeric value", () => {
    const onSave = vi.fn();
    render(<PreferencesForm preferences={prefs} state="success" saved={false} onSave={onSave} />);

    fireEvent.change(screen.getByLabelText("Umbral de saldo bajo"), { target: { value: "250.5" } });
    fireEvent.click(screen.getByRole("button", { name: "Guardar preferencias" }));

    const sent = onSave.mock.calls[0][0] as Preference[];
    expect(sent[1].thresholdAmount).toBe(250.5);
  });

  it("given saved flag then announces confirmation", () => {
    render(<PreferencesForm preferences={prefs} state="success" saved onSave={vi.fn()} />);
    expect(screen.getByRole("status").textContent).toContain("guardadas");
  });
});
