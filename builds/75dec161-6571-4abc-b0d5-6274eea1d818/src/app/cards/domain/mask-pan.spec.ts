import { maskPan } from './mask-pan';

describe('maskPan', () => {
  it('given a 16-digit PAN, when masked, then shows only last 4 digits', () => {
    expect(maskPan('4000000000001111')).toBe('**** 1111');
  });

  it('given a PAN with spaces and dashes, when masked, then ignores separators', () => {
    expect(maskPan('4000-0000 0000-2222')).toBe('**** 2222');
  });

  it('given short, empty or nullish input, when masked, then returns only asterisks', () => {
    expect(maskPan('12')).toBe('****');
    expect(maskPan('')).toBe('****');
    expect(maskPan(null)).toBe('****');
    expect(maskPan(undefined)).toBe('****');
  });

  it('given a PAN, when masked, then the full number is never present', () => {
    expect(maskPan('4000000000001111')).not.toContain('4000');
  });
});
