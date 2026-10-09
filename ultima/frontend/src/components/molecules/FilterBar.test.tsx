import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { FilterBar } from './FilterBar';

afterEach(() => {
  cleanup();
});

describe('FilterBar', () => {
  it('given selected filters when submitted then emits them with page 0', () => {
    const onSearch = vi.fn();
    render(<FilterBar onSearch={onSearch} />);

    fireEvent.change(screen.getByLabelText('Desde'), { target: { value: '2026-09-01' } });
    fireEvent.change(screen.getByLabelText('Estado'), { target: { value: 'PENDING' } });
    fireEvent.click(screen.getByRole('button', { name: 'Buscar' }));

    expect(onSearch).toHaveBeenCalledWith({ from: '2026-09-01', to: '', status: 'PENDING', page: 0 });
  });

  it('given disabled flag when rendered then search button is disabled', () => {
    render(<FilterBar onSearch={() => undefined} disabled />);

    expect((screen.getByRole('button', { name: 'Buscar' }) as HTMLButtonElement).disabled).toBe(true);
  });
});
