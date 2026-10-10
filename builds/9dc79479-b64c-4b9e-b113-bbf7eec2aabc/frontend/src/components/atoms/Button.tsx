import type { ReactNode } from 'react';

interface ButtonProps {
  onClick: () => void;
  children: ReactNode;
  variant?: 'primary' | 'ghost';
  disabled?: boolean;
  pressed?: boolean;
}

export function Button({ onClick, children, variant = 'primary', disabled = false, pressed }: ButtonProps) {
  return (
    <button
      type="button"
      className={`btn btn--${variant}`}
      onClick={onClick}
      disabled={disabled}
      aria-pressed={pressed}
    >
      {children}
    </button>
  );
}
