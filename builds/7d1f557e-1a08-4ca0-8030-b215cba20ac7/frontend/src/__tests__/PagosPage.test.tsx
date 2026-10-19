import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import type { FiltrosPagos, Pago, PagosApi, PagosPagina } from '../api/pagosClient';
import { PagosPage } from '../features/pagos/PagosPage';

const pagoEjemplo: Pago = {
  id: '00000000-0000-4000-8000-000000000001',
  referencia: 'PAG-0001',
  beneficiario: 'Servicios Eléctricos Demo',
  cuentaDestinoMask: '****1001',
  monto: '150.75',
  moneda: 'PEN',
  estado: 'APLICADO',
  fechaPago: '2026-06-14T10:00:00Z',
  canal: 'WEB'
};

function pagina(items: Pago[]): PagosPagina {
  return { items, total: items.length, page: 1, pageSize: 10 };
}

function apiFalsa(listar: (f: FiltrosPagos) => Promise<PagosPagina>): PagosApi {
  return { listar, obtener: vi.fn() };
}

describe('PagosPage', () => {
  it('given pagos disponibles when carga then los muestra en la tabla', async () => {
    render(<PagosPage api={apiFalsa(async () => pagina([pagoEjemplo]))} />);

    expect(await screen.findByText('PAG-0001')).toBeTruthy();
    expect(screen.getByText('Servicios Eléctricos Demo')).toBeTruthy();
  });

  it('given lista vacía when carga then muestra mensaje de estado', async () => {
    render(<PagosPage api={apiFalsa(async () => pagina([]))} />);

    expect(await screen.findByText(/No se encontraron pagos/)).toBeTruthy();
  });

  it('given fallo de API when carga then muestra alerta con el mensaje', async () => {
    render(<PagosPage api={apiFalsa(async () => Promise.reject(new Error('Servicio no disponible')))} />);

    const alerta = await screen.findByRole('alert');
    expect(alerta.textContent).toBe('Servicio no disponible');
  });

  it('given estado seleccionado when busca then consulta con ese filtro desde página 1', async () => {
    const listar = vi.fn(async (_f: FiltrosPagos) => pagina([pagoEjemplo]));
    render(<PagosPage api={apiFalsa(listar)} />);
    await screen.findByText('PAG-0001');

    fireEvent.change(screen.getByLabelText('Estado'), { target: { value: 'RECHAZADO' } });
    fireEvent.click(screen.getByRole('button', { name: 'Buscar' }));

    await waitFor(() => {
      const ultimo = listar.mock.calls[listar.mock.calls.length - 1]?.[0];
      expect(ultimo?.estado).toBe('RECHAZADO');
      expect(ultimo?.page).toBe(1);
    });
  });

  it('given un pago when pulsa Ver then muestra el detalle con cuenta enmascarada', async () => {
    render(<PagosPage api={apiFalsa(async () => pagina([pagoEjemplo]))} />);
    await screen.findByText('PAG-0001');

    fireEvent.click(screen.getByRole('button', { name: 'Ver detalle de PAG-0001' }));

    expect(screen.getByText('****1001')).toBeTruthy();
    expect(screen.getByRole('button', { name: 'Cerrar detalle' })).toBeTruthy();
  });
});
