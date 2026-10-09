import { describe, expect, it } from 'vitest';
import { TYPE_LABELS, maskCard, typeTone, NOTIFICATION_TYPES } from './models';

describe('models', () => {
  it('given last4 when masking then only the last 4 digits are shown', () => {
    expect(maskCard('4821')).toBe('•••• 4821');
  });

  it('given every notification type then it has a label and a tone', () => {
    for (const type of NOTIFICATION_TYPES) {
      expect(TYPE_LABELS[type].length).toBeGreaterThan(0);
      expect(typeTone(type)).toBeTruthy();
    }
  });

  it('given a block type when asking for tone then it is danger', () => {
    expect(typeTone('Bloqueo')).toBe('danger');
  });
});
