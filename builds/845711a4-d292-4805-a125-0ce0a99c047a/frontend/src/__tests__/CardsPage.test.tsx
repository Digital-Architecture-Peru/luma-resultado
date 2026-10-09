import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import type { CardsClient } from "../api/cardsClient";
import { CardsPage } from "../components/pages/CardsPage";
import { sampleCards } from "./fixtures";

const okClient: CardsClient = {
  list: () => Promise.resolve(sampleCards),
  get: () => Promise.resolve(sampleCards[0]),
};

const failingClient: CardsClient = {
  list: () => Promise.reject(new Error("Servicio no disponible")),
  get: () => Promise.reject(new Error("Servicio no disponible")),
};

describe("CardsPage", () => {
  it("given the API fails when loaded then shows an alert", async () => {
    render(<CardsPage client={failingClient} />);

    expect(await screen.findByRole("alert")).toHaveTextContent("Servicio no disponible");
  });

  it("given cards when one is selected then shows its detail", async () => {
    render(<CardsPage client={okClient} />);

    fireEvent.click(await screen.findByText("**** **** **** 4242"));

    expect(await screen.findByRole("region", { name: "Detalle de tarjeta" })).toHaveTextContent("07/28");
  });
});
