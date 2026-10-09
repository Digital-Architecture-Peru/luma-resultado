import type { ReactNode } from "react";

interface AlertProps {
  kind: "success" | "error";
  children: ReactNode;
}

/** Confirmaciones con role=status; errores con role=alert. */
export function Alert({ kind, children }: AlertProps) {
  return (
    <p className={`alert alert--${kind}`} role={kind === "error" ? "alert" : "status"}>
      {children}
    </p>
  );
}
