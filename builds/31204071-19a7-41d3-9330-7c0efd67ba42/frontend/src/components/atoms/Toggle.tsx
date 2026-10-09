interface ToggleProps {
  id: string;
  label: string;
  checked: boolean;
  disabled?: boolean;
  onChange: (checked: boolean) => void;
}

/** Átomo: interruptor accesible (checkbox con role="switch" y etiqueta asociada). */
export function Toggle({ id, label, checked, disabled = false, onChange }: ToggleProps) {
  return (
    <label className="toggle" htmlFor={id}>
      <input
        id={id}
        type="checkbox"
        role="switch"
        checked={checked}
        disabled={disabled}
        onChange={(event) => onChange(event.target.checked)}
      />
      <span className="toggle__track" aria-hidden="true" />
      <span className="toggle__label">{label}</span>
    </label>
  );
}
