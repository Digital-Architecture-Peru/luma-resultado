import { MoneyPipe } from './money.pipe';

describe('MoneyPipe', () => {
  const pipe = new MoneyPipe();

  it('given PEN amount when transforming then includes grouped digits and decimals', () => {
    expect(pipe.transform(1234.5, 'PEN')).toContain('1,234.50');
  });

  it('given USD amount when transforming then uses the dollar currency', () => {
    const text = pipe.transform(10, 'USD');
    expect(text).toContain('10.00');
    expect(text).toMatch(/US\$|\$/);
  });
});
