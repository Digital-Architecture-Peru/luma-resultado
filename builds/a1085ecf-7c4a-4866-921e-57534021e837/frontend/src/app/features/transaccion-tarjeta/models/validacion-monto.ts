export const MONTO_MAXIMO = 1_000_000;

export interface ResultadoValidacion {
  valor: number | null;
  error: string | null;
}

/** Valida un monto escrito por el usuario (admite coma o punto, maximo 2 decimales). */
export function validarMonto(texto: string): ResultadoValidacion {
  const limpio = texto.trim().replace(',', '.');
  if (limpio === '') {
    return { valor: null, error: 'Ingrese un monto' };
  }
  if (!/^\d+(\.\d{1,2})?$/.test(limpio)) {
    return { valor: null, error: 'Use solo números con hasta 2 decimales' };
  }
  const valor = Number(limpio);
  if (valor <= 0) {
    return { valor: null, error: 'El monto debe ser mayor que cero' };
  }
  if (valor > MONTO_MAXIMO) {
    return { valor: null, error: 'El monto excede el máximo permitido' };
  }
  return { valor, error: null };
}
