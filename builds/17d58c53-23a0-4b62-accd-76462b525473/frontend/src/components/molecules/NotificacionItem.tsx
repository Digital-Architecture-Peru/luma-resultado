import type { Notificacion } from '../../types/notificacion';
import { Button } from '../atoms/Button';
import { TipoBadge } from '../atoms/TipoBadge';

interface Props {
  notificacion: Notificacion;
  onMarcarLeida: (id: string) => void;
}

function formatearFecha(iso: string): string {
  const fecha = new Date(iso);
  return Number.isNaN(fecha.getTime()) ? iso : fecha.toLocaleString('es');
}

export function NotificacionItem({ notificacion, onMarcarLeida }: Props) {
  const { id, cuenta, tipo, mensaje, monto, leida, creadaEn } = notificacion;
  return (
    <li className={`notificacion ${leida ? 'notificacion--leida' : ''}`.trim()}>
      <div className="notificacion__cabecera">
        <TipoBadge tipo={tipo} />
        <span className="estado">{leida ? 'Leída' : 'Nueva'}</span>
      </div>
      <p className="notificacion__mensaje">{mensaje}</p>
      <p className="notificacion__meta">
        <span>Cuenta {cuenta}</span>
        {monto !== null && <span className="monto">Monto: {monto.toFixed(2)}</span>}
        <time dateTime={creadaEn}>{formatearFecha(creadaEn)}</time>
      </p>
      {!leida && (
        <Button variante="secundario" onClick={() => onMarcarLeida(id)} aria-label={`Marcar como leída: ${mensaje}`}>
          Marcar como leída
        </Button>
      )}
    </li>
  );
}
