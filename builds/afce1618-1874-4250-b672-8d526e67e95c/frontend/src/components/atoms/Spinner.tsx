export function Spinner({ label = "Cargando" }: { label?: string }) {
  return (
    <span className="spinner" role="status">
      <span className="spinner__dot" aria-hidden="true" />
      {label}
    </span>
  );
}
