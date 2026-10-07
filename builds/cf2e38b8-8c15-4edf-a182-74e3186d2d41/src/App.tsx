import { useMemo, useState, type FormEvent } from 'react';

type EstadoPago = 'Pagado' | 'Pendiente' | 'Rechazado';

interface Pago {
  id: string;
  beneficiario: string;
  referencia: string;
  monto: number;
  fecha: string;
  estado: EstadoPago;
}

const PAGOS_INICIALES: Pago[] = [
  { id: 'p-1001', beneficiario: 'Compañía de Luz Nacional', referencia: 'FAC-88231', monto: 125000, fecha: '2026-09-02', estado: 'Pagado' },
  { id: 'p-1002', beneficiario: 'Telecom Andina S.A.', referencia: 'FAC-77190', monto: 68900, fecha: '2026-09-18', estado: 'Pagado' },
  { id: 'p-1003', beneficiario: 'Universidad del Valle', referencia: 'MAT-2026-02', monto: 980000, fecha: '2026-10-01', estado: 'Pendiente' },
  { id: 'p-1004', beneficiario: 'Seguros Confianza', referencia: 'POL-55012', monto: 215300, fecha: '2026-09-25', estado: 'Rechazado' },
  { id: 'p-1005', beneficiario: 'Administración Edificio Aurora', referencia: 'CUO-0926', monto: 340000, fecha: '2026-09-28', estado: 'Pendiente' },
];

const ESTADOS: EstadoPago[] = ['Pagado', 'Pendiente', 'Rechazado'];

const formatoMoneda = new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 });
const formatoFecha = new Intl.DateTimeFormat('es-CO', { year: 'numeric', month: 'short', day: '2-digit' });

function nuevoId(pagos: Pago[]): string {
  const maxNum = pagos.reduce((max, p) => {
    const n = Number(p.id.replace('p-', ''));
    return Number.isFinite(n) && n > max ? n : max;
  }, 1000);
  return `p-${maxNum + 1}`;
}

interface PagoFormState {
  beneficiario: string;
  referencia: string;
  monto: string;
  fecha: string;
  estado: EstadoPago;
}

const FORM_VACIO: PagoFormState = { beneficiario: '', referencia: '', monto: '', fecha: '', estado: 'Pendiente' };

function Badge({ estado }: { estado: EstadoPago }) {
  const clase = estado === 'Pagado' ? 'badge badge--success' : estado === 'Pendiente' ? 'badge badge--warning' : 'badge badge--danger';
  return <span className={clase}>{estado}</span>;
}

export default function App() {
  const [pagos, setPagos] = useState<Pago[]>(PAGOS_INICIALES);
  const [busqueda, setBusqueda] = useState('');
  const [filtroEstado, setFiltroEstado] = useState<'Todos' | EstadoPago>('Todos');
  const [formulario, setFormulario] = useState<PagoFormState>(FORM_VACIO);
  const [editandoId, setEditandoId] = useState<string | null>(null);
  const [confirmandoBorrarId, setConfirmandoBorrarId] = useState<string | null>(null);
  const [mensaje, setMensaje] = useState<string>('');
  const [estadoCapacidad, setEstadoCapacidad] = useState<string>('');
  const [errorFormulario, setErrorFormulario] = useState<string>('');

  const pagosFiltrados = useMemo(() => {
    const termino = busqueda.trim().toLowerCase();
    return pagos.filter((p) => {
      const coincideTexto =
        termino === '' ||
        p.beneficiario.toLowerCase().includes(termino) ||
        p.referencia.toLowerCase().includes(termino);
      const coincideEstado = filtroEstado === 'Todos' || p.estado === filtroEstado;
      return coincideTexto && coincideEstado;
    });
  }, [pagos, busqueda, filtroEstado]);

  const totalFiltrado = useMemo(
    () => pagosFiltrados.reduce((suma, p) => suma + p.monto, 0),
    [pagosFiltrados]
  );

  function iniciarEdicion(pago: Pago) {
    setEditandoId(pago.id);
    setFormulario({
      beneficiario: pago.beneficiario,
      referencia: pago.referencia,
      monto: String(pago.monto),
      fecha: pago.fecha,
      estado: pago.estado,
    });
    setErrorFormulario('');
    setMensaje('');
  }

  function cancelarEdicion() {
    setEditandoId(null);
    setFormulario(FORM_VACIO);
    setErrorFormulario('');
  }

  function manejarEnvio(evento: FormEvent<HTMLFormElement>) {
    evento.preventDefault();
    const beneficiario = formulario.beneficiario.trim();
    const referencia = formulario.referencia.trim();
    const montoNumero = Number(formulario.monto);

    if (!beneficiario || !referencia || !formulario.fecha) {
      setErrorFormulario('Completa beneficiario, referencia y fecha.');
      return;
    }
    if (!Number.isFinite(montoNumero) || montoNumero <= 0) {
      setErrorFormulario('El monto debe ser un número mayor a cero.');
      return;
    }

    if (editandoId) {
      setPagos((actual) =>
        actual.map((p) =>
          p.id === editandoId
            ? { ...p, beneficiario, referencia, monto: montoNumero, fecha: formulario.fecha, estado: formulario.estado }
            : p
        )
      );
      setMensaje(`Pago de ${beneficiario} actualizado.`);
    } else {
      const id = nuevoId(pagos);
      setPagos((actual) => [
        { id, beneficiario, referencia, monto: montoNumero, fecha: formulario.fecha, estado: formulario.estado },
        ...actual,
      ]);
      setMensaje(`Pago de ${beneficiario} registrado.`);
    }

    setErrorFormulario('');
    setEditandoId(null);
    setFormulario(FORM_VACIO);
  }

  function pedirConfirmacionBorrado(id: string) {
    setConfirmandoBorrarId(id);
    setMensaje('');
  }

  function cancelarBorrado() {
    setConfirmandoBorrarId(null);
  }

  function confirmarBorrado(id: string) {
    const pago = pagos.find((p) => p.id === id);
    setPagos((actual) => actual.filter((p) => p.id !== id));
    setConfirmandoBorrarId(null);
    if (editandoId === id) {
      cancelarEdicion();
    }
    setMensaje(pago ? `Pago de ${pago.beneficiario} eliminado.` : 'Pago eliminado.');
  }

  function probarCapacidad() {
    setEstadoCapacidad('Consulta de Pagos');
  }

  return (
    <main className="app-shell">
      <header className="app-header">
        <div>
          <p className="app-kicker">Banca por Internet · Pagos</p>
          <h1>Consulta de Pagos</h1>
          <p className="app-subtitle">
            Revisa, busca y administra pagos registrados en memoria para esta capacidad de prueba.
          </p>
        </div>
        <div className="app-header__action">
          <button type="button" className="btn btn--primary" onClick={probarCapacidad}>
            Probar capacidad
          </button>
          <p role="status" className="status-pill" aria-live="polite">
            {estadoCapacidad}
          </p>
        </div>
      </header>

      {mensaje && (
        <p role="status" className="feedback feedback--success" aria-live="polite">
          {mensaje}
        </p>
      )}

      <section className="panel" aria-labelledby="titulo-filtros">
        <h2 id="titulo-filtros" className="panel__title">
          Buscar pagos
        </h2>
        <div className="filtros">
          <div className="campo">
            <label htmlFor="busqueda">Beneficiario o referencia</label>
            <input
              id="busqueda"
              type="search"
              placeholder="Ej. Telecom Andina, FAC-77190"
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
            />
          </div>
          <div className="campo">
            <label htmlFor="filtro-estado">Estado</label>
            <select
              id="filtro-estado"
              value={filtroEstado}
              onChange={(e) => setFiltroEstado(e.target.value as 'Todos' | EstadoPago)}
            >
              <option value="Todos">Todos</option>
              {ESTADOS.map((estado) => (
                <option key={estado} value={estado}>
                  {estado}
                </option>
              ))}
            </select>
          </div>
        </div>
        <p className="resumen">
          {pagosFiltrados.length} resultado(s) · total {formatoMoneda.format(totalFiltrado)}
        </p>
      </section>

      <section className="panel" aria-labelledby="titulo-tabla">
        <h2 id="titulo-tabla" className="panel__title">
          Pagos registrados
        </h2>
        {pagosFiltrados.length === 0 ? (
          <div className="estado-vacio">
            <p>No hay pagos que coincidan con la búsqueda.</p>
          </div>
        ) : (
          <div className="tabla-wrap">
            <table className="tabla">
              <thead>
                <tr>
                  <th scope="col">Beneficiario</th>
                  <th scope="col">Referencia</th>
                  <th scope="col">Fecha</th>
                  <th scope="col" className="num">Monto</th>
                  <th scope="col">Estado</th>
                  <th scope="col">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {pagosFiltrados.map((pago) => (
                  <tr key={pago.id}>
                    <td>{pago.beneficiario}</td>
                    <td>{pago.referencia}</td>
                    <td>{formatoFecha.format(new Date(pago.fecha))}</td>
                    <td className="num">{formatoMoneda.format(pago.monto)}</td>
                    <td>
                      <Badge estado={pago.estado} />
                    </td>
                    <td className="acciones">
                      <button type="button" className="btn btn--ghost" onClick={() => iniciarEdicion(pago)}>
                        Editar
                      </button>
                      {confirmandoBorrarId === pago.id ? (
                        <span className="confirmacion">
                          <span>¿Eliminar?</span>
                          <button
                            type="button"
                            className="btn btn--danger btn--sm"
                            onClick={() => confirmarBorrado(pago.id)}
                          >
                            Sí, eliminar
                          </button>
                          <button type="button" className="btn btn--ghost btn--sm" onClick={cancelarBorrado}>
                            Cancelar
                          </button>
                        </span>
                      ) : (
                        <button
                          type="button"
                          className="btn btn--danger"
                          onClick={() => pedirConfirmacionBorrado(pago.id)}
                        >
                          Eliminar
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <section className="panel" aria-labelledby="titulo-formulario">
        <h2 id="titulo-formulario" className="panel__title">
          {editandoId ? 'Editar pago' : 'Registrar pago nuevo'}
        </h2>
        <form className="formulario" onSubmit={manejarEnvio} noValidate>
          <div className="campo">
            <label htmlFor="beneficiario">Beneficiario</label>
            <input
              id="beneficiario"
              type="text"
              value={formulario.beneficiario}
              onChange={(e) => setFormulario((f) => ({ ...f, beneficiario: e.target.value }))}
              required
            />
          </div>
          <div className="campo">
            <label htmlFor="referencia">Referencia</label>
            <input
              id="referencia"
              type="text"
              value={formulario.referencia}
              onChange={(e) => setFormulario((f) => ({ ...f, referencia: e.target.value }))}
              required
            />
          </div>
          <div className="campo">
            <label htmlFor="monto">Monto (COP)</label>
            <input
              id="monto"
              type="number"
              min="1"
              step="1"
              value={formulario.monto}
              onChange={(e) => setFormulario((f) => ({ ...f, monto: e.target.value }))}
              required
            />
          </div>
          <div className="campo">
            <label htmlFor="fecha">Fecha</label>
            <input
              id="fecha"
              type="date"
              value={formulario.fecha}
              onChange={(e) => setFormulario((f) => ({ ...f, fecha: e.target.value }))}
              required
            />
          </div>
          <div className="campo">
            <label htmlFor="estado">Estado</label>
            <select
              id="estado"
              value={formulario.estado}
              onChange={(e) => setFormulario((f) => ({ ...f, estado: e.target.value as EstadoPago }))}
            >
              {ESTADOS.map((estado) => (
                <option key={estado} value={estado}>
                  {estado}
                </option>
              ))}
            </select>
          </div>
          {errorFormulario && (
            <p role="alert" className="feedback feedback--error">
              {errorFormulario}
            </p>
          )}
          <div className="formulario__acciones">
            <button type="submit" className="btn btn--primary">
              {editandoId ? 'Guardar cambios' : 'Registrar pago'}
            </button>
            {editandoId && (
              <button type="button" className="btn btn--ghost" onClick={cancelarEdicion}>
                Cancelar edición
              </button>
            )}
          </div>
        </form>
      </section>
    </main>
  );
}
