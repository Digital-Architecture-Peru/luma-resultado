import type { InputHTMLAttributes } from "react";

interface TextInputProps extends InputHTMLAttributes<HTMLInputElement> {
  invalid?: boolean;
}

export function TextInput({ invalid = false, ...rest }: TextInputProps) {
  return <input className="input" aria-invalid={invalid} {...rest} />;
}
