import { useMemo, useState } from 'react';

type EstadoTarjeta = 'Activa' | 'Bloqueada';

interface Tarjeta {
  id: string;
  titular: string;
  ultimos4: string;
  tipo: 'Débito' | 'Crédito';
  estado: EstadoTarjeta;
  saldo: number;
}

const TARJETAS_INICIALES: Tarjeta[] = [
  { id: 't1', titular: 'Ana Pérez', ultimos4: '4821', tipo: 'Crédito', estado: 'Activa', saldo: 3250000 },
  { id: 't2', titular: 'Ana Pérez', ultimos4: '1190', tipo: 'Débito', estado: 'Activa', saldo: 870000 },
  { id: 't3', titular: 'Carlos Ruiz', ultimos4: '7742', tipo: 'Crédito', estado: 'Bloqueada', saldo: 0 },
  { id: 't4', titular: 'Marta Gómez', ultimos4: '3309', tipo: 'Débito', estado: 'Activa', saldo: 1540000 },
  { id: 't5', titular: 'Luis Fernández', ultimos4: '5567', tipo: 'Crédito', estado: 'Activa', saldo: 980000 },
];

const formatoMoneda = new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 });

export default function App() {
  const [tarjetas, setTarjetas] = useState<Tarjeta[]>(TARJETAS_INICIALES);
  const [busqueda, setBusqueda] = useState('');
  const [confirmandoId, setConfirmandoId] = useState<string | null>(null);
  const [mensajeAccion, setMensajeAccion] = useState('');
  const [mensajeCapacidad, setMensajeCapacidad] = useState('');

  const resultados = useMemo(() => {
    const termino = busqueda.trim().toLowerCase();
    if (!termino) return tarjetas;
    return tarjetas.filter(
      (t) => t.titular.toLowerCase().includes(termino) || t.ultimos4.includes(termino)
    );
  }, [busqueda, tarjetas]);

  function pedirConfirmacion(id: string) {
    setConfirmandoId(id);
    setMensajeAccion('');
  }

  function cancelarConfirmacion() {
    setConfirmandoId(null);
  }

  function alternarEstado(id: string) {
    setTarjetas((prev) =>
      prev.map((t) => {
        if (t.id !== id) return t;
        const nuevoEstado: EstadoTarjeta = t.estado === 'Activa' ? 'Bloqueada' : 'Activa';
        setMensajeAccion(
          `Tarjeta terminada en ${t.ultimos4} ahora está ${nuevoEstado === 'Activa' ? 'activa' : 'bloqueada'}.`
        );
        return { ...t, estado: nuevoEstado };
      })
    );
    setConfirmandoId(null);
  }

  function probarCapacidad() {
    setMensajeCapacidad('Consulta de Tarjetas');
  }

  return (
    <main className="app-shell">
      <header className="app-header">
        <h1>Consulta de Tarjetas</h1>
        <p className="app-subtitle">Banca por Internet · Frontend React + TypeScript (datos ficticios en memoria)</p>
        <button type="button" className="btn btn-primary" onClick={probarCapacidad}>
          Probar capacidad
        </button>
        <p role="status" aria-live="polite" className="status-line">
          {mensajeCapacidad}
        </p>
      </header>

      <section className="card panel" aria-labelledby="buscar-titulo">
        <h2 id="buscar-titulo">Buscar tarjetas</h2>
        <label htmlFor="busqueda-input" className="field-label">
          Titular o últimos 4 dígitos
        </label>
        <input
          id="busqueda-input"
          type="text"
          className="input"
          placeholder="Ej. Ana Pérez o 4821"
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
        />

        {mensajeAccion && (
          <p role="status" aria-live="polite" className="status-line status-line--muted">
            {mensajeAccion}
          </p>
        )}

        <div className="table-wrap">
          {resultados.length === 0 ? (
            <p className="empty-state">No se encontraron tarjetas para "{busqueda}".</p>
          ) : (
            <table className="tabla-tarjetas">
              <thead>
                <tr>
                  <th scope="col">Titular</th>
                  <th scope="col">Tarjeta</th>
                  <th scope="col">Tipo</th>
                  <th scope="col">Estado</th>
                  <th scope="col" className="col-numero">Saldo</th>
                  <th scope="col">Acción</th>
                </tr>
              </thead>
              <tbody>
                {resultados.map((t) => (
                  <tr key={t.id}>
                    <td>{t.titular}</td>
                    <td>•••• {t.ultimos4}</td>
                    <td>{t.tipo}</td>
                    <td>
                      <span className={`badge ${t.estado === 'Activa' ? 'badge-success' : 'badge-danger'}`}>
                        {t.estado}
                      </span>
                    </td>
                    <td className="col-numero">{formatoMoneda.format(t.saldo)}</td>
                    <td>
                      {confirmandoId === t.id ? (
                        <div className="confirm-inline">
                          <span>
                            ¿Confirmar {t.estado === 'Activa' ? 'bloqueo' : 'activación'}?
                          </span>
                          <button
                            type="button"
                            className="btn btn-danger btn-sm"
                            onClick={() => alternarEstado(t.id)}
                          >
                            Sí, confirmar
                          </button>
                          <button type="button" className="btn btn-ghost btn-sm" onClick={cancelarConfirmacion}>
                            Cancelar
                          </button>
                        </div>
                      ) : (
                        <button
                          type="button"
                          className="btn btn-secondary btn-sm"
                          onClick={() => pedirConfirmacion(t.id)}
                        >
                          {t.estado === 'Activa' ? 'Bloquear' : 'Activar'}
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </section>

      <footer className="app-footer">
        <p>Candidato: datos en memoria, sin persistencia ni red. Sujeto a verificación posterior.</p>
      </footer>
    </main>
  );
}
