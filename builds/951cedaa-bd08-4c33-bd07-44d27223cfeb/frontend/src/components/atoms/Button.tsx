import type { ButtonHTMLAttributes } from 'react';

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement>;

export function Button({ className = '', ...rest }: ButtonProps) {
  return <button className={`btn ${className}`.trim()} {...rest} />;
}
