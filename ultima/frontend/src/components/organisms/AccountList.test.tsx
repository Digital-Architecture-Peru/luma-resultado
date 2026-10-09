import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import type { Cuenta } from '../../types/cuenta';
import { AccountList } from './AccountList';

const cuenta: Cuenta = {
  id: 'c1',
  numeroEnmascarado: '****0411',
  tipo: 'AHORROS',
  moneda: 'USD',
  saldo: 2540.75,
  estado: 'ACTIVA',
  actualizadoEn: '2026-10-01T10:00:00Z',
};

afterEach(() => {
  cleanup();
});

describe('AccountList', () => {
  it('given cuentas, when renders, then shows masked number', () => {
    render(<AccountList cuentas={[cuenta]} loading={false} error={null} onSelect={() => {}} />);
    expect(screen.getByText('****0411')).toBeTruthy();
    expect(screen.getByText('Activa')).toBeTruthy();
  });

  it('given empty list, when renders, then shows empty state', () => {
    render(<AccountList cuentas={[]} loading={false} error={null} onSelect={() => {}} />);
    expect(screen.getByText('No tiene cuentas registradas.')).toBeTruthy();
  });

  it('given error, when renders, then shows alert', () => {
    render(<AccountList cuentas={[]} loading={false} error="Falla" onSelect={() => {}} />);
    expect(screen.getByRole('alert').textContent).toBe('Falla');
  });

  it('given loading, when renders, then shows status', () => {
    render(<AccountList cuentas={[]} loading={true} error={null} onSelect={() => {}} />);
    expect(screen.getByRole('status')).toBeTruthy();
  });

  it('given a row, when clicked, then calls onSelect with id', () => {
    const onSelect = vi.fn();
    render(<AccountList cuentas={[cuenta]} loading={false} error={null} onSelect={onSelect} />);
    fireEvent.click(screen.getByRole('button'));
    expect(onSelect).toHaveBeenCalledWith('c1');
  });
});
