import { Spinner } from "../atoms/Spinner";

interface StatusMessageProps {
  kind: "loading" | "error" | "empty";
  message?: string;
}

export function StatusMessage({ kind, message }: StatusMessageProps) {
  if (kind === "loading") {
    return <Spinner />;
  }
  if (kind === "error") {
    return (
      <p className="message message--error" role="alert">
        {message ?? "Ocurrio un error"}
      </p>
    );
  }
  return (
    <p className="message" role="status">
      {message ?? "No hay informacion para mostrar"}
    </p>
  );
}
