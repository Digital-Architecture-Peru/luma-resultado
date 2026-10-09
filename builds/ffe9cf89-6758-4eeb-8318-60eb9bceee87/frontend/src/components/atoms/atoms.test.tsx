import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Badge from './Badge';
import Button from './Button';

describe('atoms', () => {
  it('given a tone, when rendering Badge, then shows its text', () => {
    render(<Badge tone="danger">Bloqueo</Badge>);
    expect(screen.getByText('Bloqueo')).toHaveClass('badge--danger');
  });

  it('given a handler, when clicking Button, then calls it once', async () => {
    const onClick = vi.fn();
    render(<Button onClick={onClick}>Guardar</Button>);
    await userEvent.click(screen.getByRole('button', { name: 'Guardar' }));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('given disabled, when clicking Button, then does not call the handler', async () => {
    const onClick = vi.fn();
    render(
      <Button onClick={onClick} disabled>
        Guardar
      </Button>,
    );
    await userEvent.click(screen.getByRole('button', { name: 'Guardar' }));
    expect(onClick).not.toHaveBeenCalled();
  });
});
