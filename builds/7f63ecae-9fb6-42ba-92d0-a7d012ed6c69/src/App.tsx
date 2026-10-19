import { useMemo, useState } from 'react';

type CanalNotificacion = 'Push' | 'SMS' | 'Email';
type EstadoNotificacion = 'Pendiente' | 'Enviada' | 'Fallida';

interface NotificacionPago {
  id: string;
  cliente: string;
  monto: number;
  canal: CanalNotificacion;
  estado: EstadoNotificacion;
  fecha: string;
}

let nextId = 5;

const DATOS_INICIALES: NotificacionPago[] = [
  { id: 'n1', cliente: 'Mario Rojas', monto: 125000, canal: 'Push', estado: 'Enviada', fecha: '2026-10-15' },
  { id: 'n2', cliente: 'Laura Gómez', monto: 48500, canal: 'SMS', estado: 'Pendiente', fecha: '2026-10-17' },
  { id: 'n3', cliente: 'Carlos Pena', monto: 302000, canal: 'Email', estado: 'Fallida', fecha: '2026-10-18' },
  { id: 'n4', cliente: 'Ana Duarte', monto: 15000, canal: 'Push', estado: 'Enviada', fecha: '2026-10-19' },
];

const formateadorMoneda = new Intl.NumberFormat('es-CO', {
  style: 'currency',
  currency: 'COP',
  maximumFractionDigits: 0,
});

interface FormularioNotificacion {
  cliente: string;
  monto: string;
  canal: CanalNotificacion;
  estado: EstadoNotificacion;
}

const FORMULARIO_VACIO: FormularioNotificacion = {
  cliente: '',
  monto: '',
  canal: 'Push',
  estado: 'Pendiente',
};

export default function App() {
  const [notificaciones, setNotificaciones] = useState<NotificacionPago[]>(DATOS_INICIALES);
  const [busqueda, setBusqueda] = useState('');
  const [filtroEstado, setFiltroEstado] = useState<'Todos' | EstadoNotificacion>('Todos');
  const [formulario, setFormulario] = useState<FormularioNotificacion>(FORMULARIO_VACIO);
  const [editandoId, setEditandoId] = useState<string | null>(null);
  const [errorFormulario, setErrorFormulario] = useState('');
  const [idPorConfirmar, setIdPorConfirmar] = useState<string | null>(null);
  const [mensajeAccion, setMensajeAccion] = useState('');
  const [mensajeCapacidad, setMensajeCapacidad] = useState('');

  const listaFiltrada = useMemo(() => {
    const termino = busqueda.trim().toLowerCase();
    return notificaciones.filter((n) => {
      const coincideTexto = termino === '' || n.cliente.toLowerCase().includes(termino);
      const coincideEstado = filtroEstado === 'Todos' || n.estado === filtroEstado;
      return coincideTexto && coincideEstado;
    });
  }, [notificaciones, busqueda, filtroEstado]);

  function manejarCambioFormulario(campo: keyof FormularioNotificacion, valor: string) {
    setFormulario((previo) => ({ ...previo, [campo]: valor }));
  }

  function validar(form: FormularioNotificacion): string {
    if (form.cliente.trim().length < 2) return 'El nombre del cliente debe tener al menos 2 caracteres.';
    const montoNumerico = Number(form.monto);
    if (!form.monto || Number.isNaN(montoNumerico) || montoNumerico <= 0) {
      return 'El monto debe ser un número mayor que cero.';
    }
    return '';
  }

  function manejarEnviar(evento: React.FormEvent) {
    evento.preventDefault();
    const error = validar(formulario);
    if (error) {
      setErrorFormulario(error);
      setMensajeAccion('');
      return;
    }
    setErrorFormulario('');
    const montoNumerico = Number(formulario.monto);
    const hoy = new Date().toISOString().slice(0, 10);

    if (editandoId) {
      setNotificaciones((previas) =>
        previas.map((n) =>
          n.id === editandoId
            ? { ...n, cliente: formulario.cliente.trim(), monto: montoNumerico, canal: formulario.canal, estado: formulario.estado }
            : n
        )
      );
      setMensajeAccion(`Notificación de ${formulario.cliente.trim()} actualizada.`);
      setEditandoId(null);
    } else {
      const nueva: NotificacionPago = {
        id: `n${nextId++}`,
        cliente: formulario.cliente.trim(),
        monto: montoNumerico,
        canal: formulario.canal,
        estado: formulario.estado,
        fecha: hoy,
      };
      setNotificaciones((previas) => [nueva, ...previas]);
      setMensajeAccion(`Notificación de ${nueva.cliente} creada.`);
    }
    setFormulario(FORMULARIO_VACIO);
  }

  function iniciarEdicion(notificacion: NotificacionPago) {
    setEditandoId(notificacion.id);
    setFormulario({
      cliente: notificacion.cliente,
      monto: String(notificacion.monto),
      canal: notificacion.canal,
      estado: notificacion.estado,
    });
    setErrorFormulario('');
    setMensajeAccion('');
  }

  function cancelarEdicion() {
    setEditandoId(null);
    setFormulario(FORMULARIO_VACIO);
    setErrorFormulario('');
  }

  function pedirConfirmacionEliminar(id: string) {
    setIdPorConfirmar(id);
  }

  function confirmarEliminar() {
    if (!idPorConfirmar) return;
    const objetivo = notificaciones.find((n) => n.id === idPorConfirmar);
    setNotificaciones((previas) => previas.filter((n) => n.id !== idPorConfirmar));
    setMensajeAccion(objetivo ? `Notificación de ${objetivo.cliente} eliminada.` : 'Notificación eliminada.');
    setIdPorConfirmar(null);
    if (editandoId === idPorConfirmar) cancelarEdicion();
  }

  function cancelarEliminar() {
    setIdPorConfirmar(null);
  }

  function probarCapacidad() {
    setMensajeCapacidad('Notificación de Pagos');
  }

  return (
    <main className="app-shell">
      <header className="app-header">
        <div>
          <p className="app-kicker">Banca por Internet · Pagos</p>
          <h1>Notificación de Pagos</h1>
          <p className="app-subtitle">
            Gestiona de forma simulada las notificaciones enviadas a clientes por movimientos de pago.
          </p>
        </div>
        <div className="app-header-actions">
          <button type="button" className="btn btn-primary" onClick={probarCapacidad}>
            Probar capacidad
          </button>
          <p role="status" aria-live="polite" className="status-pill">
            {mensajeCapacidad}
          </p>
        </div>
      </header>

      <section className="panel" aria-labelledby="titulo-formulario">
        <h2 id="titulo-formulario">{editandoId ? 'Editar notificación' : 'Nueva notificación'}</h2>
        <form className="form-grid" onSubmit={manejarEnviar} noValidate>
          <div className="field">
            <label htmlFor="campo-cliente">Cliente</label>
            <input
              id="campo-cliente"
              type="text"
              value={formulario.cliente}
              onChange={(e) => manejarCambioFormulario('cliente', e.target.value)}
              placeholder="Nombre del cliente"
              autoComplete="off"
            />
          </div>
          <div className="field">
            <label htmlFor="campo-monto">Monto (COP)</label>
            <input
              id="campo-monto"
              type="number"
              min="1"
              value={formulario.monto}
              onChange={(e) => manejarCambioFormulario('monto', e.target.value)}
              placeholder="0"
            />
          </div>
          <div className="field">
            <label htmlFor="campo-canal">Canal</label>
            <select
              id="campo-canal"
              value={formulario.canal}
              onChange={(e) => manejarCambioFormulario('canal', e.target.value as CanalNotificacion)}
            >
              <option value="Push">Push</option>
              <option value="SMS">SMS</option>
              <option value="Email">Email</option>
            </select>
          </div>
          <div className="field">
            <label htmlFor="campo-estado">Estado</label>
            <select
              id="campo-estado"
              value={formulario.estado}
              onChange={(e) => manejarCambioFormulario('estado', e.target.value as EstadoNotificacion)}
            >
              <option value="Pendiente">Pendiente</option>
              <option value="Enviada">Enviada</option>
              <option value="Fallida">Fallida</option>
            </select>
          </div>

          {errorFormulario && (
            <p className="field-error" role="alert">
              {errorFormulario}
            </p>
          )}

          <div className="form-actions">
            <button type="submit" className="btn btn-primary">
              {editandoId ? 'Guardar cambios' : 'Crear notificación'}
            </button>
            {editandoId && (
              <button type="button" className="btn btn-ghost" onClick={cancelarEdicion}>
                Cancelar edición
              </button>
            )}
          </div>
        </form>
        {mensajeAccion && (
          <p role="status" aria-live="polite" className="form-feedback">
            {mensajeAccion}
          </p>
        )}
      </section>

      <section className="panel" aria-labelledby="titulo-lista">
        <div className="panel-header">
          <h2 id="titulo-lista">Notificaciones registradas</h2>
          <div className="filters">
            <div className="field field-search">
              <label htmlFor="campo-busqueda">Buscar por cliente</label>
              <input
                id="campo-busqueda"
                type="search"
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                placeholder="Ej. Laura"
              />
            </div>
            <div className="field">
              <label htmlFor="campo-filtro-estado">Estado</label>
              <select
                id="campo-filtro-estado"
                value={filtroEstado}
                onChange={(e) => setFiltroEstado(e.target.value as 'Todos' | EstadoNotificacion)}
              >
                <option value="Todos">Todos</option>
                <option value="Pendiente">Pendiente</option>
                <option value="Enviada">Enviada</option>
                <option value="Fallida">Fallida</option>
              </select>
            </div>
          </div>
        </div>

        {listaFiltrada.length === 0 ? (
          <p className="empty-state">No hay notificaciones que coincidan con la búsqueda o el filtro.</p>
        ) : (
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th scope="col">Cliente</th>
                  <th scope="col" className="num">Monto</th>
                  <th scope="col">Canal</th>
                  <th scope="col">Estado</th>
                  <th scope="col">Fecha</th>
                  <th scope="col">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {listaFiltrada.map((n) => (
                  <tr key={n.id}>
                    <td>{n.cliente}</td>
                    <td className="num">{formateadorMoneda.format(n.monto)}</td>
                    <td>{n.canal}</td>
                    <td>
                      <span className={`badge badge-${n.estado.toLowerCase()}`}>{n.estado}</span>
                    </td>
                    <td>{n.fecha}</td>
                    <td className="actions-cell">
                      <button type="button" className="btn btn-secondary btn-sm" onClick={() => iniciarEdicion(n)}>
                        Editar
                      </button>
                      <button
                        type="button"
                        className="btn btn-danger btn-sm"
                        onClick={() => pedirConfirmacionEliminar(n.id)}
                      >
                        Eliminar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {idPorConfirmar && (
        <div className="confirm-overlay" role="presentation">
          <div className="confirm-dialog" role="alertdialog" aria-modal="true" aria-labelledby="titulo-confirmar">
            <h2 id="titulo-confirmar">Confirmar eliminación</h2>
            <p>¿Deseas eliminar esta notificación? Esta acción no se puede deshacer.</p>
            <div className="form-actions">
              <button type="button" className="btn btn-danger" onClick={confirmarEliminar}>
                Sí, eliminar
              </button>
              <button type="button" className="btn btn-ghost" onClick={cancelarEliminar}>
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
