import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import type { BuscarPagos, Pagina, Pago } from '../types/pagos';
import { ConsultaPagosPage } from './ConsultaPagosPage';

const pago: Pago = {
  id: 1,
  cuenta: '****1234',
  beneficiario: 'Colegio Ejemplo',
  concepto: 'Pensión octubre',
  monto: 310,
  moneda: 'USD',
  estado: 'PENDIENTE',
  fechaPago: '2026-10-01T08:00:00Z',
};

const pagina: Pagina<Pago> = { contenido: [pago], page: 0, size: 10, total: 1 };

describe('ConsultaPagosPage', () => {
  it('given datos disponibles when carga then muestra los pagos', async () => {
    const api: BuscarPagos = vi.fn(async () => pagina);

    render(<ConsultaPagosPage api={api} />);

    expect(await screen.findByText('Colegio Ejemplo')).toBeInTheDocument();
    expect(api).toHaveBeenCalledWith({ desde: '', hasta: '', estado: '' }, 0, 10);
  });

  it('given un filtro de estado when consulta then reenvía los filtros desde la página 0', async () => {
    const api = vi.fn<BuscarPagos>(async () => pagina);
    render(<ConsultaPagosPage api={api} />);
    await screen.findByText('Colegio Ejemplo');

    await userEvent.selectOptions(screen.getByLabelText('Estado'), 'PENDIENTE');
    await userEvent.click(screen.getByRole('button', { name: 'Consultar' }));

    await vi.waitFor(() =>
      expect(api).toHaveBeenLastCalledWith({ desde: '', hasta: '', estado: 'PENDIENTE' }, 0, 10),
    );
  });

  it('given fallo del servicio when carga then muestra el error en una alerta', async () => {
    const api: BuscarPagos = vi.fn(async () => {
      throw new Error("'size' inválido");
    });

    render(<ConsultaPagosPage api={api} />);

    expect(await screen.findByRole('alert')).toHaveTextContent("'size' inválido");
  });

  it('given respuesta vacía when carga then muestra el estado vacío', async () => {
    const api: BuscarPagos = vi.fn(async () => ({ contenido: [], page: 0, size: 10, total: 0 }));

    render(<ConsultaPagosPage api={api} />);

    expect(await screen.findByText(/No se encontraron pagos/)).toBeInTheDocument();
  });
});
