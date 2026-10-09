import { useCallback, useRef, useState } from "react";
import type { TransferInput, TransferReceipt, TransfersClient } from "../types";

export type TransferState =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "success"; receipt: TransferReceipt }
  | { status: "error"; message: string };

export function useTransfer(client: TransfersClient) {
  const [state, setState] = useState<TransferState>({ status: "idle" });
  // La misma clave se reutiliza en reintentos hasta que la operación tenga éxito.
  const keyRef = useRef<string>(crypto.randomUUID());

  const submit = useCallback(
    async (input: TransferInput) => {
      setState({ status: "loading" });
      try {
        const receipt = await client.createTransfer(input, keyRef.current);
        keyRef.current = crypto.randomUUID();
        setState({ status: "success", receipt });
      } catch (err) {
        const message = err instanceof Error ? err.message : "No se pudo completar la transferencia";
        setState({ status: "error", message });
      }
    },
    [client],
  );

  return { state, submit };
}
