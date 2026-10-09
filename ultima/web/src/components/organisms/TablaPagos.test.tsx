import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import type { Pago } from "../../types/pago";
import { TablaPagos } from "./TablaPagos";

const pagos: Pago[] = [
  {
    id: "00000000-0000-0000-0000-000000000001",
    referencia: "REF-DEMO-0001",
    beneficiario: "Agua Potable Demo",
    cuentaDestino: "****1111",
    monto: 38.45,
    moneda: "USD",
    estado: "PROCESADO",
    fechaPago: "2026-10-01T10:00:00Z",
  },
  {
    id: "00000000-0000-0000-0000-000000000002",
    referencia: "REF-DEMO-0002",
    beneficiario: "Telecom Prueba",
    cuentaDestino: "****2222",
    monto: 120,
    moneda: "USD",
    estado: "RECHAZADO",
    fechaPago: "2026-10-02T10:00:00Z",
  },
];

describe("TablaPagos", () => {
  it("given una lista vacía when se renderiza then muestra el mensaje de estado vacío", () => {
    render(<TablaPagos pagos={[]} locale="en-US" onSeleccionar={() => {}} />);

    expect(screen.getByRole("status")).toHaveTextContent("No hay pagos");
    expect(screen.queryByRole("table")).not.toBeInTheDocument();
  });

  it("given pagos when se renderiza then muestra una fila por pago con estado y monto", () => {
    render(<TablaPagos pagos={pagos} locale="en-US" onSeleccionar={() => {}} />);

    expect(screen.getAllByRole("row")).toHaveLength(3);
    expect(screen.getByText("REF-DEMO-0002")).toBeInTheDocument();
    expect(screen.getByText("Rechazado")).toBeInTheDocument();
    expect(screen.getByText("$38.45")).toBeInTheDocument();
  });

  it("given pagos when se pulsa Ver detalle then notifica el pago seleccionado", () => {
    const onSeleccionar = vi.fn();
    render(<TablaPagos pagos={pagos} locale="en-US" onSeleccionar={onSeleccionar} />);

    fireEvent.click(screen.getByRole("button", { name: "Ver detalle de REF-DEMO-0001" }));

    expect(onSeleccionar).toHaveBeenCalledWith(pagos[0]);
  });
});
