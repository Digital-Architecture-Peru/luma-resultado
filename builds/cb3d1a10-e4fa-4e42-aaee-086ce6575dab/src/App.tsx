import { useMemo, useState } from 'react';

interface Tarjeta {
  id: string;
  alias: string;
  titular: string;
  numeroEnmascarado: string;
  saldoDisponible: number;
}

interface Transaccion {
  id: string;
  tarjetaOrigenId: string;
  tarjetaDestinoId: string;
  monto: number;
  concepto: string;
  fecha: string;
  estado: 'confirmada' | 'anulada';
}

const TARJETAS_INICIALES: Tarjeta[] = [
  { id: 'c1', alias: 'Tarjeta Clásica', titular: 'Ana Rojas', numeroEnmascarado: '**** 4412', saldoDisponible: 2_350_000 },
  { id: 'c2', alias: 'Tarjeta Oro', titular: 'Ana Rojas', numeroEnmascarado: '**** 7781', saldoDisponible: 980_500 },
  { id: 'c3', alias: 'Tarjeta Platino', titular: 'Ana Rojas', numeroEnmascarado: '**** 2290', saldoDisponible: 5_120_000 },
];

const TRANSACCIONES_INICIALES: Transaccion[] = [
  { id: 't1', tarjetaOrigenId: 'c3', tarjetaDestinoId: 'c1', monto: 150_000, concepto: 'Pago de servicios', fecha: '2026-10-01', estado: 'confirmada' },
  { id: 't2', tarjetaOrigenId: 'c1', tarjetaDestinoId: 'c2', monto: 60_000, concepto: 'Traslado de cupo', fecha: '2026-10-03', estado: 'confirmada' },
];

const formateaMonto = (valor: number): string =>
  valor.toLocaleString('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 });

const generaId = (): string => `t${Math.random().toString(36).slice(2, 9)}`;

function obtieneAlias(tarjetas: Tarjeta[], id: string): string {
  const tarjeta = tarjetas.find((t) => t.id === id);
  return tarjeta ? `${tarjeta.alias} (${tarjeta.numeroEnmascarado})` : 'Tarjeta desconocida';
}

export default function App() {
  const [tarjetas, setTarjetas] = useState<Tarjeta[]>(TARJETAS_INICIALES);
  const [transacciones, setTransacciones] = useState<Transaccion[]>(TRANSACCIONES_INICIALES);

  const [origenId, setOrigenId] = useState(tarjetas[0]?.id ?? '');
  const [destinoId, setDestinoId] = useState(tarjetas[1]?.id ?? '');
  const [monto, setMonto] = useState('');
  const [concepto, setConcepto] = useState('');
  const [errorFormulario, setErrorFormulario] = useState('');
  const [mensajeTransaccion, setMensajeTransaccion] = useState('');

  const [busqueda, setBusqueda] = useState('');
  const [idPendienteAnular, setIdPendienteAnular] = useState<string | null>(null);

  const [estadoCapacidad, setEstadoCapacidad] = useState('');

  const transaccionesFiltradas = useMemo(() => {
    const termino = busqueda.trim().toLowerCase();
    if (!termino) return transacciones;
    return transacciones.filter((t) => {
      const aliasOrigen = obtieneAlias(tarjetas, t.tarjetaOrigenId).toLowerCase();
      const aliasDestino = obtieneAlias(tarjetas, t.tarjetaDestinoId).toLowerCase();
      return (
        t.concepto.toLowerCase().includes(termino) ||
        aliasOrigen.includes(termino) ||
        aliasDestino.includes(termino) ||
        t.fecha.includes(termino)
      );
    });
  }, [busqueda, transacciones, tarjetas]);

  function manejaEnvioTransaccion(evento: React.FormEvent<HTMLFormElement>) {
    evento.preventDefault();
    setErrorFormulario('');
    setMensajeTransaccion('');

    const montoNumerico = Number(monto);
    if (!origenId || !destinoId) {
      setErrorFormulario('Selecciona tarjeta origen y destino.');
      return;
    }
    if (origenId === destinoId) {
      setErrorFormulario('La tarjeta origen y destino deben ser distintas.');
      return;
    }
    if (!monto || Number.isNaN(montoNumerico) || montoNumerico <= 0) {
      setErrorFormulario('Ingresa un monto válido mayor a cero.');
      return;
    }
    const tarjetaOrigen = tarjetas.find((t) => t.id === origenId);
    if (!tarjetaOrigen || tarjetaOrigen.saldoDisponible < montoNumerico) {
      setErrorFormulario('Saldo insuficiente en la tarjeta origen.');
      return;
    }
    if (!concepto.trim()) {
      setErrorFormulario('Describe el concepto de la transacción.');
      return;
    }

    const nuevaTransaccion: Transaccion = {
      id: generaId(),
      tarjetaOrigenId: origenId,
      tarjetaDestinoId: destinoId,
      monto: montoNumerico,
      concepto: concepto.trim(),
      fecha: new Date().toISOString().slice(0, 10),
      estado: 'confirmada',
    };

    setTarjetas((previas) =>
      previas.map((t) => {
        if (t.id === origenId) return { ...t, saldoDisponible: t.saldoDisponible - montoNumerico };
        if (t.id === destinoId) return { ...t, saldoDisponible: t.saldoDisponible + montoNumerico };
        return t;
      }),
    );
    setTransacciones((previas) => [nuevaTransaccion, ...previas]);
    setMensajeTransaccion(
      `Transacción registrada: ${formateaMonto(montoNumerico)} de ${obtieneAlias(tarjetas, origenId)} a ${obtieneAlias(
        tarjetas,
        destinoId,
      )}.`,
    );
    setMonto('');
    setConcepto('');
  }

  function solicitaAnulacion(id: string) {
    setIdPendienteAnular(id);
  }

  function confirmaAnulacion() {
    if (!idPendienteAnular) return;
    const transaccion = transacciones.find((t) => t.id === idPendienteAnular);
    if (transaccion && transaccion.estado === 'confirmada') {
      setTarjetas((previas) =>
        previas.map((t) => {
          if (t.id === transaccion.tarjetaOrigenId) return { ...t, saldoDisponible: t.saldoDisponible + transaccion.monto };
          if (t.id === transaccion.tarjetaDestinoId) return { ...t, saldoDisponible: t.saldoDisponible - transaccion.monto };
          return t;
        }),
      );
    }
    setTransacciones((previas) => previas.map((t) => (t.id === idPendienteAnular ? { ...t, estado: 'anulada' } : t)));
    setIdPendienteAnular(null);
  }

  function canceliaAnulacion() {
    setIdPendienteAnular(null);
  }

  return (
    <main className="app-shell">
      <header className="app-header">
        <p className="app-kicker">Banca por Internet · Tarjetas</p>
        <h1>Transacción de Tarjetas</h1>
        <p className="app-subtitle">Transfiere cupo entre tus tarjetas, consulta el historial y anula movimientos recientes.</p>
        <div className="capacidad-bloque">
          <button type="button" className="boton boton-fantasma" onClick={() => setEstadoCapacidad('Transacción de Tarjetas')}>
            Probar capacidad
          </button>
          <p role="status" className="capacidad-estado">
            {estadoCapacidad}
          </p>
        </div>
      </header>

      <section className="tarjetas-resumen" aria-label="Resumen de tarjetas">
        {tarjetas.map((t) => (
          <article key={t.id} className="tarjeta-card">
            <h2>{t.alias}</h2>
            <p className="tarjeta-numero">{t.numeroEnmascarado}</p>
            <p className="tarjeta-titular">{t.titular}</p>
            <p className="tarjeta-saldo">{formateaMonto(t.saldoDisponible)}</p>
          </article>
        ))}
      </section>

      <section className="panel-formulario" aria-label="Registrar nueva transacción">
        <h2>Nueva transacción</h2>
        <form onSubmit={manejaEnvioTransaccion} className="formulario-transaccion" noValidate>
          <div className="campo">
            <label htmlFor="origen">Tarjeta origen</label>
            <select id="origen" value={origenId} onChange={(e) => setOrigenId(e.target.value)}>
              {tarjetas.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.alias} ({t.numeroEnmascarado})
                </option>
              ))}
            </select>
          </div>
          <div className="campo">
            <label htmlFor="destino">Tarjeta destino</label>
            <select id="destino" value={destinoId} onChange={(e) => setDestinoId(e.target.value)}>
              {tarjetas.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.alias} ({t.numeroEnmascarado})
                </option>
              ))}
            </select>
          </div>
          <div className="campo">
            <label htmlFor="monto">Monto</label>
            <input
              id="monto"
              type="number"
              min="1"
              step="1"
              inputMode="numeric"
              value={monto}
              onChange={(e) => setMonto(e.target.value)}
              placeholder="100000"
            />
          </div>
          <div className="campo campo-ancho">
            <label htmlFor="concepto">Concepto</label>
            <input
              id="concepto"
              type="text"
              value={concepto}
              onChange={(e) => setConcepto(e.target.value)}
              placeholder="Ej. Pago de servicios"
            />
          </div>
          <div className="campo campo-accion">
            <button type="submit" className="boton boton-primario">
              Registrar transacción
            </button>
          </div>
        </form>
        {errorFormulario && (
          <p role="alert" className="mensaje-error">
            {errorFormulario}
          </p>
        )}
        {mensajeTransaccion && (
          <p role="status" className="mensaje-exito">
            {mensajeTransaccion}
          </p>
        )}
      </section>

      <section className="panel-historial" aria-label="Historial de transacciones">
        <div className="historial-cabecera">
          <h2>Historial</h2>
          <div className="campo campo-busqueda">
            <label htmlFor="busqueda">Buscar</label>
            <input
              id="busqueda"
              type="search"
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              placeholder="Concepto, tarjeta o fecha"
            />
          </div>
        </div>

        {transaccionesFiltradas.length === 0 ? (
          <p className="estado-vacio">No hay transacciones que coincidan con la búsqueda.</p>
        ) : (
          <table className="tabla-historial">
            <thead>
              <tr>
                <th scope="col">Fecha</th>
                <th scope="col">Origen</th>
                <th scope="col">Destino</th>
                <th scope="col">Monto</th>
                <th scope="col">Concepto</th>
                <th scope="col">Estado</th>
                <th scope="col">Acción</th>
              </tr>
            </thead>
            <tbody>
              {transaccionesFiltradas.map((t) => (
                <tr key={t.id}>
                  <td>{t.fecha}</td>
                  <td>{obtieneAlias(tarjetas, t.tarjetaOrigenId)}</td>
                  <td>{obtieneAlias(tarjetas, t.tarjetaDestinoId)}</td>
                  <td className="celda-numerica">{formateaMonto(t.monto)}</td>
                  <td>{t.concepto}</td>
                  <td>
                    <span className={`insignia insignia-${t.estado}`}>
                      {t.estado === 'confirmada' ? 'Confirmada' : 'Anulada'}
                    </span>
                  </td>
                  <td>
                    {t.estado === 'confirmada' ? (
                      idPendienteAnular === t.id ? (
                        <span className="confirmacion-inline">
                          <span>¿Anular?</span>
                          <button type="button" className="boton boton-peligro boton-chico" onClick={confirmaAnulacion}>
                            Sí, anular
                          </button>
                          <button type="button" className="boton boton-secundario boton-chico" onClick={canceliaAnulacion}>
                            Cancelar
                          </button>
                        </span>
                      ) : (
                        <button
                          type="button"
                          className="boton boton-secundario boton-chico"
                          onClick={() => solicitaAnulacion(t.id)}
                        >
                          Anular
                        </button>
                      )
                    ) : (
                      <span className="texto-mudo">—</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>

      <footer className="app-footer">
        <p>Datos ficticios en memoria. Sin conexión a red ni persistencia real.</p>
      </footer>
    </main>
  );
}
