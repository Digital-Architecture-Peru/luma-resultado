import { useEffect, useState } from 'react';
import { AccountDetail } from '../components/organisms/AccountDetail';
import { AccountList } from '../components/organisms/AccountList';
import { BankingLayout } from '../components/templates/BankingLayout';
import { listarCuentas } from '../services/cuentasApi';
import type { Cuenta } from '../types/cuenta';

const CLIENTE_ID: string =
  import.meta.env.VITE_CLIENTE_ID ?? 'aaaaaaaa-0000-0000-0000-000000000001';

export function CuentasPage() {
  const [cuentas, setCuentas] = useState<Cuenta[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [seleccion, setSeleccion] = useState<string | null>(null);

  useEffect(() => {
    let activo = true;
    listarCuentas(CLIENTE_ID)
      .then((datos) => {
        if (activo) setCuentas(datos);
      })
      .catch((e: unknown) => {
        if (activo) setError(e instanceof Error ? e.message : 'Error inesperado.');
      })
      .finally(() => {
        if (activo) setLoading(false);
      });
    return () => {
      activo = false;
    };
  }, []);

  const detalle = cuentas.find((c) => c.id === seleccion);

  return (
    <BankingLayout title="Mis cuentas">
      <AccountList cuentas={cuentas} loading={loading} error={error} onSelect={setSeleccion} />
      {detalle && <AccountDetail cuenta={detalle} onClose={() => setSeleccion(null)} />}
    </BankingLayout>
  );
}
