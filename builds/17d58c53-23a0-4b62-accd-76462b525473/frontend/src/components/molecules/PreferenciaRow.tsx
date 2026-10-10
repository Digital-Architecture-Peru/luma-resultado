import { useState } from 'react';
import type { Preferencia } from '../../types/notificacion';
import { Button } from '../atoms/Button';
import { etiquetaTipo } from '../atoms/TipoBadge';

interface Props {
  preferencia: Preferencia;
  onGuardar: (preferencia: Preferencia) => void;
}

function parsearUmbral(texto: string): number | null {
  if (texto.trim() === '') return null;
  const valor = Number(texto);
  return Number.isFinite(valor) && valor >= 0 ? valor : Number.NaN;
}

export function PreferenciaRow({ preferencia, onGuardar }: Props) {
  const { tipo, canal, activo, umbralMonto } = preferencia;
  const [umbral, setUmbral] = useState(umbralMonto === null ? '' : String(umbralMonto));
  const nombre = `${etiquetaTipo(tipo)} por ${canal}`;
  const valorUmbral = parsearUmbral(umbral);
  const umbralInvalido = Number.isNaN(valorUmbral);

  return (
    <li className="preferencia">
      <label className="preferencia__activo">
        <input
          type="checkbox"
          checked={activo}
          onChange={(e) => onGuardar({ ...preferencia, activo: e.target.checked })}
        />
        {nombre}
      </label>
      <label className="preferencia__umbral">
        Umbral de monto ({nombre})
        <input
          type="number"
          min="0"
          step="0.01"
          value={umbral}
          aria-invalid={umbralInvalido}
          onChange={(e) => setUmbral(e.target.value)}
        />
      </label>
      <Button
        variante="secundario"
        disabled={umbralInvalido}
        onClick={() => onGuardar({ ...preferencia, umbralMonto: valorUmbral })}
        aria-label={`Guardar umbral de ${nombre}`}
      >
        Guardar
      </Button>
    </li>
  );
}
