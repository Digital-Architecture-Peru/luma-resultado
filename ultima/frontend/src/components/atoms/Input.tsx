import type { InputHTMLAttributes } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  invalid?: boolean;
}

export function Input({ invalid = false, ...rest }: InputProps) {
  return <input className="input" aria-invalid={invalid || undefined} {...rest} />;
}
