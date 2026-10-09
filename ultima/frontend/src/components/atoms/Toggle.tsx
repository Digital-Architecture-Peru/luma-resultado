interface ToggleProps {
  /** Nombre accesible completo (p. ej. "Compra aprobada por Correo"). */
  label: string;
  visibleText?: string;
  checked: boolean;
  disabled?: boolean;
  onChange: (checked: boolean) => void;
}

export function Toggle({ label, visibleText, checked, disabled = false, onChange }: ToggleProps) {
  return (
    <label className={`toggle${disabled ? ' toggle--disabled' : ''}`}>
      <input
        type="checkbox"
        role="switch"
        aria-label={label}
        checked={checked}
        disabled={disabled}
        onChange={(event) => onChange(event.target.checked)}
      />
      {visibleText ? <span className="toggle__text">{visibleText}</span> : null}
    </label>
  );
}
