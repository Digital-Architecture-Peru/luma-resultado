import { MaskAccountPipe, maskAccountNumber } from './mask-account.pipe';

describe('MaskAccountPipe', () => {
  const pipe = new MaskAccountPipe();

  it('given a full number when transformed then only last 4 digits remain', () => {
    expect(pipe.transform('0012345678')).toBe('•••• 5678');
  });

  it('given separators when transformed then they are ignored', () => {
    expect(pipe.transform('00-1234-9999')).toBe('•••• 9999');
  });

  it('given an already masked value when transformed then it is unchanged', () => {
    expect(pipe.transform('•••• 5678')).toBe('•••• 5678');
  });

  it('given null, undefined or short input when transformed then fully masked', () => {
    expect(pipe.transform(null)).toBe('••••');
    expect(pipe.transform(undefined)).toBe('••••');
    expect(maskAccountNumber('12')).toBe('••••');
  });
});
