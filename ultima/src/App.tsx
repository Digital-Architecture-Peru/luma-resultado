import { useMemo, useState } from 'react';

type Cuenta = {
  id: string;
  numero: string;
  titular: string;
  tipo: 'Ahorros' | 'Corriente';
  moneda: 'USD' | 'EUR';
  saldo: number;
  estado: 'Activa' | 'Bloqueada';
};

const CUENTAS_INICIALES: Cuenta[] = [
  { id: 'c1', numero: '0001-2233-44', titular: 'María Fernanda López', tipo: 'Ahorros', moneda: 'USD', saldo: 4520.75, estado: 'Activa' },
  { id: 'c2', numero: '0002-5566-77', titular: 'Jorge Andrés Pérez', tipo: 'Corriente', moneda: 'USD', saldo: 150.2, estado: 'Activa' },
  { id: 'c3', numero: '0003-8899-00', titular: 'Lucía Valentina Ríos', tipo: 'Ahorros', moneda: 'EUR', saldo: 980.0, estado: 'Bloqueada' },
  { id: 'c4', numero: '0004-1122-33', titular: 'Carlos Eduardo Gómez', tipo: 'Corriente', moneda: 'USD', saldo: 12750.4, estado: 'Activa' },
  { id: 'c5', numero: '0005-4455-66', titular: 'Ana Sofía Torres', tipo: 'Ahorros', moneda: 'USD', saldo: 60.0, estado: 'Activa' },
];

function formatearMonto(saldo: number, moneda: Cuenta['moneda']): string {
  return new Intl.NumberFormat('es-ES', { style: 'currency', currency: moneda }).format(saldo);
}

export default function App() {
  const [cuentas] = useState<Cuenta[]>(CUENTAS_INICIALES);
  const [termino, setTermino] = useState('');
  const [seleccionadaId, setSeleccionadaId] = useState<string | null>(null);
  const [mensajeCapacidad, setMensajeCapacidad] = useState<string | null>(null);
  const [confirmarId, setConfirmarId] = useState<string | null>(null);
  const [anuncioAccion, setAnuncioAccion] = useState<string | null>(null);

  const cuentasFiltradas = useMemo(() => {
    const texto = termino.trim().toLowerCase();
    if (!texto) return cuentas;
    return cuentas.filter(
      (c) =>
        c.numero.toLowerCase().includes(texto) ||
        c.titular.toLowerCase().includes(texto) ||
        c.tipo.toLowerCase().includes(texto)
    );
  }, [cuentas, termino]);

  const cuentaSeleccionada = cuentas.find((c) => c.id === seleccionadaId) ?? null;

  function manejarProbarCapacidad() {
    const total = cuentas.length;
    const activas = cuentas.filter((c) => c.estado === 'Activa').length;
    setMensajeCapacidad(
      `Consulta de Cuentas: capacidad simulada ejecutada sobre ${total} cuentas (${activas} activas).`
    );
  }

  function pedirConfirmacionSaldo(id: string) {
    setConfirmarId(id);
    setAnuncioAccion(null);
  }

  function cancelarConfirmacion() {
    setConfirmarId(null);
  }

  function confirmarConsultaSaldo(cuenta: Cuenta) {
    setConfirmarId(null);
    setAnuncioAccion(
      `Saldo confirmado para la cuenta ${cuenta.numero}: ${formatearMonto(cuenta.saldo, cuenta.moneda)}.`
    );
  }

  return (
    <main className="layout">
      <header className="encabezado">
        <h1>Consulta de Cuentas</h1>
        <p className="subtitulo">Banca por Internet · Capacidad de consulta sobre cuentas (datos ficticios en memoria)</p>
      </header>

      <section className="panel" aria-labelledby="probar-heading">
        <h2 id="probar-heading">Probar la capacidad</h2>
        <p>Ejecuta una verificación simulada de la capacidad de consulta de cuentas.</p>
        <button type="button" className="btn btn-primario" onClick={manejarProbarCapacidad}>
          Probar capacidad
        </button>
        <p role="status" aria-live="polite" className="estado-resultado">
          {mensajeCapacidad ?? ''}
        </p>
      </section>

      <section className="panel" aria-labelledby="buscar-heading">
        <h2 id="buscar-heading">Buscar cuentas</h2>
        <label htmlFor="buscador" className="etiqueta">
          Buscar por número, titular o tipo
        </label>
        <input
          id="buscador"
          type="search"
          className="campo-texto"
          placeholder="Ej. Ahorros, 0001, López"
          value={termino}
          onChange={(e) => setTermino(e.target.value)}
        />
        <p className="contador-resultados" aria-live="polite">
          {cuentasFiltradas.length} cuenta(s) encontrada(s)
        </p>
      </section>

      <section className="panel" aria-labelledby="listado-heading">
        <h2 id="listado-heading">Cuentas</h2>
        {cuentasFiltradas.length === 0 ? (
          <p className="vacio">No se encontraron cuentas con ese criterio.</p>
        ) : (
          <div className="tabla-contenedor">
            <table className="tabla">
              <thead>
                <tr>
                  <th scope="col">Número</th>
                  <th scope="col">Titular</th>
                  <th scope="col">Tipo</th>
                  <th scope="col">Estado</th>
                  <th scope="col" className="col-numerica">
                    Saldo
                  </th>
                  <th scope="col">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {cuentasFiltradas.map((c) => (
                  <tr key={c.id} className={c.id === seleccionadaId ? 'fila-activa' : ''}>
                    <td>{c.numero}</td>
                    <td>{c.titular}</td>
                    <td>{c.tipo}</td>
                    <td>
                      <span className={`insignia ${c.estado === 'Activa' ? 'insignia-ok' : 'insignia-alerta'}`}>
                        {c.estado}
                      </span>
                    </td>
                    <td className="col-numerica">{formatearMonto(c.saldo, c.moneda)}</td>
                    <td className="col-acciones">
                      <button
                        type="button"
                        className="btn btn-secundario"
                        onClick={() => setSeleccionadaId(c.id)}
                        aria-pressed={c.id === seleccionadaId}
                      >
                        Ver detalle
                      </button>
                      <button type="button" className="btn btn-fantasma" onClick={() => pedirConfirmacionSaldo(c.id)}>
                        Confirmar saldo
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {cuentaSeleccionada && (
        <section className="panel" aria-labelledby="detalle-heading">
          <h2 id="detalle-heading">Detalle de la cuenta</h2>
          <dl className="detalle-lista">
            <div>
              <dt>Número</dt>
              <dd>{cuentaSeleccionada.numero}</dd>
            </div>
            <div>
              <dt>Titular</dt>
              <dd>{cuentaSeleccionada.titular}</dd>
            </div>
            <div>
              <dt>Tipo</dt>
              <dd>{cuentaSeleccionada.tipo}</dd>
            </div>
            <div>
              <dt>Moneda</dt>
              <dd>{cuentaSeleccionada.moneda}</dd>
            </div>
            <div>
              <dt>Saldo</dt>
              <dd>{formatearMonto(cuentaSeleccionada.saldo, cuentaSeleccionada.moneda)}</dd>
            </div>
            <div>
              <dt>Estado</dt>
              <dd>{cuentaSeleccionada.estado}</dd>
            </div>
          </dl>
        </section>
      )}

      {confirmarId && (
        <section className="panel panel-confirmacion" aria-labelledby="confirmar-heading">
          <h2 id="confirmar-heading">Confirmar consulta de saldo</h2>
          <p>¿Confirmas consultar el saldo de la cuenta seleccionada?</p>
          <div className="acciones-confirmacion">
            <button
              type="button"
              className="btn btn-primario"
              onClick={() => {
                const cuenta = cuentas.find((c) => c.id === confirmarId);
                if (cuenta) confirmarConsultaSaldo(cuenta);
              }}
            >
              Confirmar
            </button>
            <button type="button" className="btn btn-fantasma" onClick={cancelarConfirmacion}>
              Cancelar
            </button>
          </div>
        </section>
      )}

      <p role="status" aria-live="polite" className="anuncio-accion">
        {anuncioAccion ?? ''}
      </p>
    </main>
  );
}
