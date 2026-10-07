import { MaskPanPipe } from './mask-pan.pipe';

describe('MaskPanPipe', () => {
  const pipe = new MaskPanPipe();

  it('given a full PAN when transformed then only last 4 digits are shown', () => {
    expect(pipe.transform('4111 1111 1111 1234')).toBe('**** 1234');
  });

  it('given an already masked value when transformed then it is normalized', () => {
    expect(pipe.transform('**** 4821')).toBe('**** 4821');
  });

  it('given empty or null when transformed then returns empty string', () => {
    expect(pipe.transform('')).toBe('');
    expect(pipe.transform(null)).toBe('');
    expect(pipe.transform(undefined)).toBe('');
  });

  it('given value without digits when transformed then returns stars only', () => {
    expect(pipe.transform('abc')).toBe('****');
  });
});
