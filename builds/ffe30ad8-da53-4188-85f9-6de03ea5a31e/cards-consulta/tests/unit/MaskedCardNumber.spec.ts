import { describe, expect, it } from 'vitest';
import { mount } from '@vue/test-utils';
import MaskedCardNumber from '../../src/components/atoms/MaskedCardNumber.vue';

describe('MaskedCardNumber', () => {
  it('given last4 when rendering then shows only •••• 1234', () => {
    const w = mount(MaskedCardNumber, { props: { last4: '1234' } });
    expect(w.text()).toBe('•••• 1234');
  });

  it('given an invalid value when rendering then shows no digits', () => {
    const w = mount(MaskedCardNumber, { props: { last4: '4111111111111111' } });
    expect(w.text()).toBe('•••• ····');
  });
});
