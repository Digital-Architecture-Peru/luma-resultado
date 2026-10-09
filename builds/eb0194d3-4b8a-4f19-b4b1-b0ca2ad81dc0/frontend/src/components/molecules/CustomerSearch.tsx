import { useState, type FormEvent } from "react";
import { Button } from "../atoms/Button";

interface CustomerSearchProps {
  initialValue: string;
  disabled?: boolean;
  onSearch: (customerId: string) => void;
}

export function CustomerSearch({ initialValue, disabled = false, onSearch }: CustomerSearchProps) {
  const [value, setValue] = useState(initialValue);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmed = value.trim();
    if (trimmed) {
      onSearch(trimmed);
    }
  };

  return (
    <form className="search" onSubmit={handleSubmit}>
      <label htmlFor="customerId">Código de cliente</label>
      <input
        id="customerId"
        value={value}
        maxLength={36}
        onChange={(event) => setValue(event.target.value)}
      />
      <Button type="submit" disabled={disabled || value.trim() === ""}>
        Consultar tarjetas
      </Button>
    </form>
  );
}
