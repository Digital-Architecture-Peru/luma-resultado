import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { Pagination } from './Pagination';

describe('Pagination', () => {
  it('given first page when rendered then previous is disabled', () => {
    render(<Pagination page={1} pageSize={10} total={25} onChange={() => {}} />);

    expect(screen.getByRole('button', { name: 'Anterior' })).toBeDisabled();
    expect(screen.getByText('Página 1 de 3')).toBeInTheDocument();
  });

  it('given middle page when next clicked then onChange called with page+1', async () => {
    const onChange = vi.fn();
    render(<Pagination page={2} pageSize={10} total={25} onChange={onChange} />);

    await userEvent.click(screen.getByRole('button', { name: 'Siguiente' }));

    expect(onChange).toHaveBeenCalledWith(3);
  });

  it('given last page when rendered then next is disabled', () => {
    render(<Pagination page={3} pageSize={10} total={25} onChange={() => {}} />);

    expect(screen.getByRole('button', { name: 'Siguiente' })).toBeDisabled();
  });
});
