import type { TipoEvento } from '../../types/notificacion';

const ETIQUETAS: Record<TipoEvento, string> = {
  ABONO: 'Abono',
  CARGO: 'Cargo',
  SALDO_BAJO: 'Saldo bajo',
};

export function etiquetaTipo(tipo: TipoEvento): string {
  return ETIQUETAS[tipo];
}

export function TipoBadge({ tipo }: { tipo: TipoEvento }) {
  return <span className={`badge badge--${tipo.toLowerCase()}`}>{etiquetaTipo(tipo)}</span>;
}
