import { renderHook, waitFor } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import type { Tarjeta, TarjetasApi } from '../types/tarjeta';
import { useTarjetas } from './useTarjetas';

const tarjeta: Tarjeta = {
  id: '1',
  marca: 'VISA',
  tipo: 'CREDITO',
  numeroEnmascarado: '**** 4242',
  estado: 'ACTIVA',
  limite: 5000,
  saldo: 100,
  moneda: 'USD',
  venceMesAnio: '08/28',
};

describe('useTarjetas', () => {
  it('given api ok when monta then pasa de loading a success con tarjetas', async () => {
    const api: TarjetasApi = { listar: async () => ({ items: [tarjeta], pagina: 0, tamano: 20, total: 1 }) };

    const { result } = renderHook(() => useTarjetas(api));
    expect(result.current.estado).toBe('loading');

    await waitFor(() => expect(result.current.estado).toBe('success'));
    expect(result.current.tarjetas).toEqual([tarjeta]);
  });

  it('given api falla when monta then estado error con mensaje', async () => {
    const api: TarjetasApi = {
      listar: async () => {
        throw new Error('caído');
      },
    };

    const { result } = renderHook(() => useTarjetas(api));

    await waitFor(() => expect(result.current.estado).toBe('error'));
    expect(result.current.error).toBe('caído');
  });
});
