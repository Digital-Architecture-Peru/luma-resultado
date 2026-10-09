import { formatMonto } from './monto.atom';
import { etiquetaEstado } from './badge-estado.atom';

describe('atoms', () => {
  it('given USD amount when formatting with en-US then shows currency and separators', () => {
    expect(formatMonto(1234.5, 'USD', 'en-US')).toBe('$1,234.50');
  });

  it('given zero when formatting then keeps two decimals', () => {
    expect(formatMonto(0, 'USD', 'en-US')).toBe('$0.00');
  });

  it('given each status when labeling then returns Spanish text', () => {
    expect(etiquetaEstado('ACTIVA')).toBe('Activa');
    expect(etiquetaEstado('BLOQUEADA')).toBe('Bloqueada');
    expect(etiquetaEstado('CERRADA')).toBe('Cerrada');
  });
});
