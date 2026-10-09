import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { Button } from './Button';

describe('Button', () => {
  it('given children when rendered then exposes an accessible button', () => {
    render(<Button>Pagar</Button>);
    expect(screen.getByRole('button', { name: 'Pagar' })).toBeTruthy();
  });

  it('given onClick when clicked then calls it once', () => {
    const onClick = vi.fn();
    render(<Button onClick={onClick}>Pagar</Button>);
    fireEvent.click(screen.getByRole('button', { name: 'Pagar' }));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('given disabled then does not call onClick', () => {
    const onClick = vi.fn();
    render(
      <Button disabled onClick={onClick}>
        Pagar
      </Button>,
    );
    fireEvent.click(screen.getByRole('button', { name: 'Pagar' }));
    expect(onClick).not.toHaveBeenCalled();
  });
});
