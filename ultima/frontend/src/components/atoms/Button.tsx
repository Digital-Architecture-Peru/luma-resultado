import type { ButtonHTMLAttributes } from 'react';

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement>;

export function Button({ className = '', type = 'button', ...rest }: ButtonProps) {
  return <button type={type} className={`btn ${className}`.trim()} {...rest} />;
}
