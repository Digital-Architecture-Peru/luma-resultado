import type { RemoteState } from "../../hooks/useCards";
import type { CardDetail } from "../../types/card";
import Amount from "../atoms/Amount";
import MaskedPan from "../atoms/MaskedPan";
import StatusBadge from "../atoms/StatusBadge";

interface CardDetailPanelProps {
  state: RemoteState<CardDetail>;
}

export default function CardDetailPanel({ state }: CardDetailPanelProps) {
  if (state.status === "idle") {
    return <p className="empty">Selecciona una tarjeta para ver su detalle.</p>;
  }
  if (state.status === "loading") {
    return <p role="status">Cargando detalle...</p>;
  }
  if (state.status === "error") {
    return <p role="alert" className="error">{state.message}</p>;
  }

  const card = state.data;
  return (
    <section className="detail" aria-label={`Detalle de ${card.alias}`}>
      <h2>{card.alias}</h2>
      <MaskedPan value={card.maskedNumber} />
      <dl>
        <dt>Tipo</dt>
        <dd>{card.type === "CREDIT" ? "Credito" : "Debito"}</dd>
        <dt>Estado</dt>
        <dd><StatusBadge status={card.status} /></dd>
        <dt>Linea de credito</dt>
        <dd><Amount value={card.creditLimit} currency={card.currency} /></dd>
        <dt>Saldo disponible</dt>
        <dd><Amount value={card.availableBalance} currency={card.currency} /></dd>
        <dt>Vencimiento</dt>
        <dd>{card.expiryDate}</dd>
      </dl>
    </section>
  );
}
