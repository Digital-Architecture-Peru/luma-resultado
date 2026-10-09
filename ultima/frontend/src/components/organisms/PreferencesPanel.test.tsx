import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import type { Preference } from '../../api/types';
import { CHANNEL_ORDER, EVENT_ORDER } from '../../model/notifications';
import { PreferencesPanel } from './PreferencesPanel';

const matrix: Preference[] = EVENT_ORDER.flatMap((eventType) =>
  CHANNEL_ORDER.map((channel) => ({ eventType, channel, enabled: channel === 'InApp' })),
);

function renderPanel(overrides: Partial<Parameters<typeof PreferencesPanel>[0]> = {}) {
  const props = { preferences: matrix, saving: false, saved: false, error: null, onToggle: vi.fn(), onSave: vi.fn(), ...overrides };
  render(<PreferencesPanel {...props} />);
  return props;
}

describe('PreferencesPanel', () => {
  it('given security events, when rendered, then their in-app switch is checked and disabled', () => {
    renderPanel();

    const blocked = screen.getByRole('switch', { name: 'Bloqueo de tarjeta por En la banca' });
    expect(blocked).toBeChecked();
    expect(blocked).toBeDisabled();
  });

  it('given a non-protected event, when email switch is toggled, then calls onToggle with the new value', async () => {
    const { onToggle } = renderPanel();

    await userEvent.click(screen.getByRole('switch', { name: 'Cambio de límite por Correo' }));

    expect(onToggle).toHaveBeenCalledWith('LimitChanged', 'Email', true);
  });

  it('given a save click, when rendered, then calls onSave', async () => {
    const { onSave } = renderPanel();

    await userEvent.click(screen.getByRole('button', { name: 'Guardar preferencias' }));

    expect(onSave).toHaveBeenCalledTimes(1);
  });

  it('given an error and saved flag, when rendered, then shows the alert and the confirmation', () => {
    renderPanel({ error: 'Falló el guardado', saved: true });

    expect(screen.getByRole('alert')).toHaveTextContent('Falló el guardado');
    expect(screen.getByText('Preferencias guardadas.')).toBeInTheDocument();
  });
});
