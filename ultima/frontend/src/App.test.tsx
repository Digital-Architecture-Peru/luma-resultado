import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import { App } from './App';
import type { TarjetasApi } from './api/tarjetasApi';
import type { Tarjeta } from './model';

const activa: Tarjeta = {
  id: 'tc-001',
  tipo: 'CREDITO',
  marca: 'VISA',
  numeroEnmascarado: '**** **** **** 1111',
  titular: 'Ana Pérez Demo',
  estado: 'ACTIVA',
  limite: 5000,
  saldoDisponible: 3250.75,
  vencimiento: '12/28',
};

afterEach(() => {
  cleanup();
});

describe('App', () => {
  it('given api ok when carga then muestra tarjetas enmascaradas', async () => {
    const api: TarjetasApi = { listar: vi.fn().mockResolvedValue([activa]) };
    render(<App api={api} />);
    await waitFor(() => expect(screen.getByText('**** **** **** 1111')).toBeTruthy());
    // "Activa" también existe como opción del filtro: se acota a la tarjeta.
    const tarjeta = screen.getByRole('article', { name: 'Tarjeta VISA **** **** **** 1111' });
    expect(within(tarjeta).getByText('Activa')).toBeTruthy();
    expect(api.listar).toHaveBeenCalledWith('TODAS');
  });

  it('given api falla when carga then muestra alerta de error', async () => {
    const api: TarjetasApi = { listar: vi.fn().mockRejectedValue(new Error('HTTP 500')) };
    render(<App api={api} />);
    const alerta = await screen.findByRole('alert');
    expect(alerta.textContent).toBe('HTTP 500');
  });

  it('given lista vacía when carga then muestra mensaje vacío', async () => {
    const api: TarjetasApi = { listar: vi.fn().mockResolvedValue([]) };
    render(<App api={api} />);
    expect(await screen.findByText('No hay tarjetas para el filtro seleccionado.')).toBeTruthy();
  });

  it('given filtro cambiado when selecciona Bloqueada then consulta con ese estado', async () => {
    const api: TarjetasApi = { listar: vi.fn().mockResolvedValue([activa]) };
    render(<App api={api} />);
    await screen.findByText('**** **** **** 1111');
    fireEvent.change(screen.getByLabelText('Estado'), { target: { value: 'BLOQUEADA' } });
    await waitFor(() => expect(api.listar).toHaveBeenLastCalledWith('BLOQUEADA'));
  });
});
