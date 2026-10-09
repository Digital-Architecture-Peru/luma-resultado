import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import type { Tarjeta } from '../../types/tarjeta';
import { ListaTarjetas } from './ListaTarjetas';

const tarjeta: Tarjeta = {
  id: '1',
  marca: 'MASTERCARD',
  tipo: 'DEBITO',
  numeroEnmascarado: '**** 1111',
  estado: 'ACTIVA',
  limite: 0,
  saldo: 830.1,
  moneda: 'USD',
  venceMesAnio: '03/27',
};

describe('ListaTarjetas', () => {
  it('given loading when render then muestra estado de carga', () => {
    render(<ListaTarjetas estado="loading" tarjetas={[]} error={null} onReintentar={() => {}} />);
    expect(screen.getByRole('status').textContent).toContain('Cargando');
  });

  it('given success sin tarjetas when render then muestra estado vacío', () => {
    render(<ListaTarjetas estado="success" tarjetas={[]} error={null} onReintentar={() => {}} />);
    expect(screen.getByRole('status').textContent).toContain('No tienes tarjetas');
  });

  it('given success con tarjetas when render then lista cada tarjeta', () => {
    render(<ListaTarjetas estado="success" tarjetas={[tarjeta]} error={null} onReintentar={() => {}} />);
    expect(screen.getAllByRole('listitem')).toHaveLength(1);
    expect(screen.getByText('**** 1111')).toBeTruthy();
  });

  it('given error when click reintentar then invoca el callback', () => {
    const onReintentar = vi.fn();
    render(<ListaTarjetas estado="error" tarjetas={[]} error="falló" onReintentar={onReintentar} />);

    expect(screen.getByRole('alert').textContent).toContain('falló');
    fireEvent.click(screen.getByRole('button', { name: 'Reintentar' }));
    expect(onReintentar).toHaveBeenCalledTimes(1);
  });
});
