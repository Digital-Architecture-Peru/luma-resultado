import type { ButtonHTMLAttributes } from 'react';

type Props = ButtonHTMLAttributes<HTMLButtonElement> & { variante?: 'primario' | 'secundario' };

export function Button({ variante = 'primario', className = '', type = 'button', ...resto }: Props) {
  return <button type={type} className={`btn btn--${variante} ${className}`.trim()} {...resto} />;
}
