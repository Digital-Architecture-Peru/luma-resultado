import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import type { Tarjeta } from '../../types/tarjeta';
import { TarjetaCard } from './TarjetaCard';

const base: Tarjeta = {
  id: '1',
  marca: 'VISA',
  tipo: 'CREDITO',
  numeroEnmascarado: '**** 4242',
  estado: 'BLOQUEADA',
  limite: 5000,
  saldo: 100,
  moneda: 'USD',
  venceMesAnio: '08/28',
};

describe('TarjetaCard', () => {
  it('given tarjeta de crédito when render then muestra número enmascarado, estado y límite', () => {
    render(<TarjetaCard tarjeta={base} />);

    expect(screen.getByText('**** 4242')).toBeTruthy();
    expect(screen.getByText('Bloqueada')).toBeTruthy();
    expect(screen.getByText('Límite')).toBeTruthy();
  });

  it('given tarjeta de débito when render then no muestra límite', () => {
    render(<TarjetaCard tarjeta={{ ...base, tipo: 'DEBITO', estado: 'ACTIVA' }} />);

    expect(screen.queryByText('Límite')).toBeNull();
    expect(screen.getByText('Débito')).toBeTruthy();
  });
});
