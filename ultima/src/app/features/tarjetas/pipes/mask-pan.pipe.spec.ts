import { MaskPanPipe } from './mask-pan.pipe';

describe('MaskPanPipe', () => {
  const pipe = new MaskPanPipe();

  it('given un PAN con espacios when se transforma then muestra solo los últimos 4 dígitos', () => {
    expect(pipe.transform('4000 0000 0000 1234')).toBe('**** 1234');
  });

  it('given null o vacío when se transforma then devuelve cadena vacía', () => {
    expect(pipe.transform(null)).toBe('');
    expect(pipe.transform(undefined)).toBe('');
    expect(pipe.transform('')).toBe('');
  });

  it('given una entrada corta when se transforma then no falla', () => {
    expect(pipe.transform('12')).toBe('**** 12');
  });
});
