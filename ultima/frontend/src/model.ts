export type EstadoTarjeta = 'ACTIVA' | 'BLOQUEADA' | 'VENCIDA';

export interface Tarjeta {
  id: string;
  tipo: 'CREDITO' | 'DEBITO';
  marca: string;
  numeroEnmascarado: string;
  titular: string;
  estado: EstadoTarjeta;
  limite: number;
  saldoDisponible: number;
  vencimiento: string;
}

export type FiltroEstado = EstadoTarjeta | 'TODAS';

export function formatearMonto(valor: number): string {
  return new Intl.NumberFormat('es-PE', { style: 'currency', currency: 'USD' }).format(valor);
}
