import { FiltroPagos, Pago } from './pago.model';

function normalizar(texto: string): string {
  return texto
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim();
}

function coincideTexto(pago: Pago, textoNormalizado: string): boolean {
  if (textoNormalizado === '') {
    return true;
  }
  const campos = [pago.beneficiario, pago.concepto, pago.referencia];
  return campos.some((campo) => normalizar(campo).includes(textoNormalizado));
}

/** Filtra por texto (beneficiario, concepto, referencia) y estado; ordena por fecha descendente. */
export function filtrarPagos(pagos: readonly Pago[], filtro: FiltroPagos): Pago[] {
  const texto = normalizar(filtro.texto);
  return pagos
    .filter((p) => filtro.estado === 'TODOS' || p.estado === filtro.estado)
    .filter((p) => coincideTexto(p, texto))
    .sort((a, b) => b.fecha.localeCompare(a.fecha));
}
