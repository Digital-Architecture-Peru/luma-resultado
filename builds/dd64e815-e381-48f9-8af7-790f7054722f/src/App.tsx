import { useMemo, useState, type FormEvent } from 'react';

type EstadoPago = 'pendiente' | 'completado' | 'rechazado';

interface Transaccion {
  id: string;
  beneficiario: string;
  cuentaDestino: string;
  monto: number;
  fecha: string;
  estado: EstadoPago;
}

let nextId = 4;

const datosIniciales: Transaccion[] = [
  { id: 't1', beneficiario: 'Ana Torres', cuentaDestino: '001-2233445-6', monto: 125000, fecha: '2026-10-01', estado: 'completado' },
  { id: 't2', beneficiario: 'Luis Gomez', cuentaDestino: '002-9988776-1', monto: 45000, fecha: '2026-10-10', estado: 'pendiente' },
  { id: 't3', beneficiario: 'Constructora Delta', cuentaDestino: '003-1122334-9', monto: 980000, fecha: '2026-10-15', estado: 'rechazado' },
];

const formatoMoneda = new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 });

function esMontoValido(valor: string): boolean {
  const n = Number(valor);
  return valor.trim() !== '' && Number.isFinite(n) && n > 0;
}

export default function App() {
  const [transacciones, setTransacciones] = useState<Transaccion[]>(datosIniciales);
  const [busqueda, setBusqueda] = useState('');
  const [beneficiario, setBeneficiario] = useState('');
  const [cuentaDestino, setCuentaDestino] = useState('');
  const [monto, setMonto] = useState('');
  const [errores, setErrores] = useState<string[]>([]);
  const [idAEliminar, setIdAEliminar] = useState<string | null>(null);
  const [mensajeFormulario, setMensajeFormulario] = useState('');
  const [mensajeCapacidad, setMensajeCapacidad] = useState('');

  const transaccionesFiltradas = useMemo(() => {
    const termino = busqueda.trim().toLowerCase();
    if (!termino) return transacciones;
    return transacciones.filter(
      (t) =>
        t.beneficiario.toLowerCase().includes(termino) ||
        t.cuentaDestino.toLowerCase().includes(termino) ||
        t.estado.toLowerCase().includes(termino)
    );
  }, [transacciones, busqueda]);

  function validarFormulario(): string[] {
    const nuevosErrores: string[] = [];
    if (beneficiario.trim().length < 3) nuevosErrores.push('El beneficiario debe tener al menos 3 caracteres.');
    if (!/^\d{3}-\d{7}-\d$/.test(cuentaDestino.trim())) nuevosErrores.push('La cuenta destino debe tener el formato 000-0000000-0.');
    if (!esMontoValido(monto)) nuevosErrores.push('El monto debe ser un numero mayor a cero.');
    return nuevosErrores;
  }

  function registrarTransaccion(evento: FormEvent) {
    evento.preventDefault();
    const nuevosErrores = validarFormulario();
    setErrores(nuevosErrores);
    if (nuevosErrores.length > 0) {
      setMensajeFormulario('');
      return;
    }
    const nueva: Transaccion = {
      id: 't' + nextId++,
      beneficiario: beneficiario.trim(),
      cuentaDestino: cuentaDestino.trim(),
      monto: Number(monto),
      fecha: new Date().toISOString().slice(0, 10),
      estado: 'pendiente',
    };
    setTransacciones((prev) => [nueva, ...prev]);
    setBeneficiario('');
    setCuentaDestino('');
    setMonto('');
    setMensajeFormulario('Transaccion registrada para ' + nueva.beneficiario + ' por ' + formatoMoneda.format(nueva.monto) + '.');
  }

  function pedirConfirmacionEliminar(id: string) {
    setIdAEliminar(id);
    setMensajeFormulario('');
  }

  function confirmarEliminacion() {
    if (!idAEliminar) return;
    const eliminada = transacciones.find((t) => t.id === idAEliminar);
    setTransacciones((prev) => prev.filter((t) => t.id !== idAEliminar));
    setIdAEliminar(null);
    if (eliminada) {
      setMensajeFormulario('Transaccion de ' + eliminada.beneficiario + ' eliminada.');
    }
  }

  function cancelarEliminacion() {
    setIdAEliminar(null);
  }

  function probarCapacidad() {
    setMensajeCapacidad('Transacción de Pagos');
  }

  const transaccionAEliminar = transacciones.find((t) => t.id === idAEliminar) || null;

  return (
    <main className="app">
      <header className="app-header">
        <h1>Transaccion de Pagos - Banca por Internet</h1>
        <p className="app-subtitle">Simulacion en memoria para registrar, consultar y eliminar transacciones de pago.</p>
      </header>

      <section className="panel" aria-labelledby="capacidad-titulo">
        <h2 id="capacidad-titulo">Probar la capacidad</h2>
        <p>Valida rapidamente que la capacidad de Transaccion de Pagos esta disponible.</p>
        <button type="button" className="btn btn-primary" onClick={probarCapacidad}>
          Probar capacidad
        </button>
        <p role="status" className="status-text">
          {mensajeCapacidad}
        </p>
      </section>

      <section className="panel" aria-labelledby="form-titulo">
        <h2 id="form-titulo">Registrar nueva transaccion</h2>
        <form onSubmit={registrarTransaccion} noValidate>
          <div className="campo">
            <label htmlFor="beneficiario">Beneficiario</label>
            <input
              id="beneficiario"
              name="beneficiario"
              type="text"
              value={beneficiario}
              onChange={(e) => setBeneficiario(e.target.value)}
              placeholder="Nombre completo"
              autoComplete="off"
            />
          </div>
          <div className="campo">
            <label htmlFor="cuentaDestino">Cuenta destino</label>
            <input
              id="cuentaDestino"
              name="cuentaDestino"
              type="text"
              value={cuentaDestino}
              onChange={(e) => setCuentaDestino(e.target.value)}
              placeholder="000-0000000-0"
              autoComplete="off"
            />
          </div>
          <div className="campo">
            <label htmlFor="monto">Monto (COP)</label>
            <input
              id="monto"
              name="monto"
              type="number"
              min="1"
              step="1"
              value={monto}
              onChange={(e) => setMonto(e.target.value)}
              placeholder="100000"
            />
          </div>
          <button type="submit" className="btn btn-primary">
            Registrar transaccion
          </button>
          {errores.length > 0 && (
            <ul className="lista-errores" role="alert">
              {errores.map((err) => (
                <li key={err}>{err}</li>
              ))}
            </ul>
          )}
          <p role="status" className="status-text">
            {mensajeFormulario}
          </p>
        </form>
      </section>

      <section className="panel" aria-labelledby="lista-titulo">
        <div className="lista-encabezado">
          <h2 id="lista-titulo">Transacciones registradas</h2>
          <div className="campo campo-busqueda">
            <label htmlFor="busqueda">Buscar por beneficiario, cuenta o estado</label>
            <input
              id="busqueda"
              name="busqueda"
              type="search"
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              placeholder="Ej. Ana, pendiente, 001"
            />
          </div>
        </div>

        {transaccionesFiltradas.length === 0 ? (
          <p className="estado-vacio">No hay transacciones que coincidan con la busqueda.</p>
        ) : (
          <div className="tabla-contenedor">
            <table>
              <caption className="visually-hidden">Lista de transacciones de pago</caption>
              <thead>
                <tr>
                  <th scope="col">Beneficiario</th>
                  <th scope="col">Cuenta destino</th>
                  <th scope="col">Monto</th>
                  <th scope="col">Fecha</th>
                  <th scope="col">Estado</th>
                  <th scope="col">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {transaccionesFiltradas.map((t) => (
                  <tr key={t.id}>
                    <td>{t.beneficiario}</td>
                    <td>{t.cuentaDestino}</td>
                    <td className="numero">{formatoMoneda.format(t.monto)}</td>
                    <td>{t.fecha}</td>
                    <td>
                      <span className={'badge badge-' + t.estado}>{t.estado}</span>
                    </td>
                    <td>
                      <button type="button" className="btn btn-danger" onClick={() => pedirConfirmacionEliminar(t.id)}>
                        Eliminar
                        <span className="visually-hidden"> transaccion de {t.beneficiario}</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {transaccionAEliminar && (
        <div className="overlay-confirmacion" role="alertdialog" aria-labelledby="confirmar-titulo" aria-modal="true">
          <div className="dialogo-confirmacion">
            <h2 id="confirmar-titulo">Confirmar eliminacion</h2>
            <p>Seguro que deseas eliminar la transaccion de {transaccionAEliminar.beneficiario}? Esta accion no se puede deshacer.</p>
            <div className="dialogo-acciones">
              <button type="button" className="btn btn-secundario" onClick={cancelarEliminacion}>
                Cancelar
              </button>
              <button type="button" className="btn btn-danger" onClick={confirmarEliminacion}>
                Confirmar eliminacion
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
