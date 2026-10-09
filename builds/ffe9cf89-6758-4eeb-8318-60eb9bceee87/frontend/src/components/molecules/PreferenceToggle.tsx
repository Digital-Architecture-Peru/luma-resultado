interface PreferenceToggleProps {
  label: string;
  checked: boolean;
  onChange: () => void;
}

export default function PreferenceToggle({ label, checked, onChange }: PreferenceToggleProps) {
  return (
    <label className="toggle">
      <input type="checkbox" checked={checked} onChange={onChange} />
      <span>{label}</span>
    </label>
  );
}
