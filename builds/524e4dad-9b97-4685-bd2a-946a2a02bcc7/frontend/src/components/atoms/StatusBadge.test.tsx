import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { StatusBadge } from './StatusBadge';

describe('StatusBadge', () => {
  it('given REJECTED when rendered then shows spanish label', () => {
    render(<StatusBadge status="REJECTED" />);

    expect(screen.getByText('Rechazado')).toHaveClass('badge--rejected');
  });
});
