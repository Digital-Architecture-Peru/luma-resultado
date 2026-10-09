import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Amount } from './Amount';
import { Badge } from './Badge';

describe('atoms', () => {
  it('given estado RECHAZADO when render Badge then muestra el texto y la clase', () => {
    render(<Badge estado="RECHAZADO" />);

    const badge = screen.getByText('Rechazado');
    expect(badge).toHaveClass('badge--rechazado');
  });

  it('given monto y moneda when render Amount then formatea con dos decimales', () => {
    render(<Amount valor={1234.5} moneda="USD" />);

    expect(screen.getByText(/1[.,\s\u00a0]?234[.,]50/)).toBeInTheDocument();
  });

  it('given moneda inválida when render Amount then usa formato de respaldo', () => {
    render(<Amount valor={10} moneda="??" />);

    expect(screen.getByText('10.00 ??')).toBeInTheDocument();
  });
});
