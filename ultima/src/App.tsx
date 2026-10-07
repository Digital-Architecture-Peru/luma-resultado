import { useMemo, useState } from 'react';

type Canal = 'Email' | 'SMS' | 'Push';
type Estado = 'Programada' | 'Enviada' | 'Fallida';

interface NotificacionPago {
  id: string;
  destinatario: string;
  monto: number;
  canal: Canal;
  estado: Estado;
  fecha: string;
}

let nextId = 4;

const DATOS_INICIALES: NotificacionPago[] = [
  { id: 'n1', destinatario: 'Ana Torres', monto: 125000, canal: 'Email', estado: 'Enviada', fecha: '2026-10-01' },
  { id: 'n2', destinatario: 'Carlos Ruiz', monto: 48000, canal: 'SMS', estado: 'Programada', fecha: '2026-10-05' },
  { id: 'n3', destinatario: 'Lucía Pardo', monto: 980000, canal: 'Push', estado: 'Fallida', fecha: '2026-10-03' },
];

const formatoMonto = new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 });

interface FormState {
  destinatario: string;
  monto: string;
  canal: Canal;
  estado: Estado;
  fecha: string;
}

const FORM_VACIO: FormState = { destinatario: '', monto: '', canal: 'Email', estado: 'Programada', fecha: '' };

function validar(form: FormState): string | null {
  if (!form.destinatario.trim()) return 'El destinatario es obligatorio.';
  if (!form.monto || Number(form.monto) <= 0) return 'El monto debe ser mayor a cero.';
  if (!form.fecha) return 'La fecha es obligatoria.';
  return null;
}

export default function App() {
  const [capacidadMensaje, setCapacidadMensaje] = useState('');
  const [notificaciones, setNotificaciones] = useState<NotificacionPago[]>(DATOS_INICIALES);
  const [busqueda, setBusqueda] = useState('');
  const [filtroEstado, setFiltroEstado] = useState<'Todas' | Estado>('Todas');
  const [form, setForm] = useState<FormState>(FORM_VACIO);
  const [editandoId, setEditandoId] = useState<string | null>(null);
  const [errorForm, setErrorForm] = useState<string | null>(null);
  const [pendienteEliminar, setPendienteEliminar] = useState<NotificacionPago | null>(null);
  const [mensajeAccion, setMensajeAccion] = useState('');

  const listaFiltrada = useMemo(() => {
    const texto = busqueda.trim().toLowerCase();
    return notificaciones.filter((n) => {
      const coincideTexto = !texto || n.destinatario.toLowerCase().includes(texto);
      const coincideEstado = filtroEstado === 'Todas' || n.estado === filtroEstado;
      return coincideTexto && coincideEstado;
    });
  }, [notificaciones, busqueda, filtroEstado]);

  function probarCapacidad() {
    setCapacidadMensaje('Notificación de Pagos');
  }

  function iniciarEdicion(n: NotificacionPago) {
    setEditandoId(n.id);
    setForm({
      destinatario: n.destinatario,
      monto: String(n.monto),
      canal: n.canal,
      estado: n.estado,
      fecha: n.fecha,
    });
    setErrorForm(null);
    setMensajeAccion('');
  }

  function cancelarEdicion() {
    setEditandoId(null);
    setForm(FORM_VACIO);
    setErrorForm(null);
  }

  function guardar(e: React.FormEvent) {
    e.preventDefault();
    const error = validar(form);
    if (error) {
      setErrorForm(error);
      return;
    }
    setErrorForm(null);
    const monto = Number(form.monto);
    if (editandoId) {
      setNotificaciones((prev) =>
        prev.map((n) =>
          n.id === editandoId
            ? { ...n, destinatario: form.destinatario.trim(), monto, canal: form.canal, estado: form.estado, fecha: form.fecha }
            : n,
        ),
      );
      setMensajeAccion(`Notificación de ${form.destinatario.trim()} actualizada.`);
      setEditandoId(null);
    } else {
      const nueva: NotificacionPago = {
        id: `n${nextId++}`,
        destinatario: form.destinatario.trim(),
        monto,
        canal: form.canal,
        estado: form.estado,
        fecha: form.fecha,
      };
      setNotificaciones((prev) => [nueva, ...prev]);
      setMensajeAccion(`Notificación de ${nueva.destinatario} creada.`);
    }
    setForm(FORM_VACIO);
  }

  function pedirEliminar(n: NotificacionPago) {
    setPendienteEliminar(n);
  }

  function confirmarEliminar() {
    if (!pendienteEliminar) return;
    setNotificaciones((prev) => prev.filter((n) => n.id !== pendienteEliminar.id));
    setMensajeAccion(`Notificación de ${pendienteEliminar.destinatario} eliminada.`);
    setPendienteEliminar(null);
    if (editandoId === pendienteEliminar.id) cancelarEdicion();
  }

  function cancelarEliminar() {
    setPendienteEliminar(null);
  }

  return (
    <main className="app-shell">
      <header className="app-header">
        <div>
          <p className="eyebrow">Banca por Internet · Pagos</p>
          <h1>Notificación de Pagos</h1>
          <p className="subtitle">Gestiona las notificaciones de pago enviadas a los clientes: crea, edita, busca y elimina registros ficticios en memoria.</p>
        </div>
        <div className="capacidad-box">
          <button type="button" className="btn btn-primary" onClick={probarCapacidad}>
            Probar capacidad
          </button>
          <p role="status" className="capacidad-status">
            {capacidadMensaje}
          </p>
        </div>
      </header>

      <section className="panel" aria-labelledby="form-titulo">
        <h2 id="form-titulo">{editandoId ? 'Editar notificación' : 'Nueva notificación'}</h2>
        <form onSubmit={guardar} className="form-grid" noValidate>
          <div className="field">
            <label htmlFor="destinatario">Destinatario</label>
            <input
              id="destinatario"
              type="text"
              value={form.destinatario}
              onChange={(e) => setForm({ ...form, destinatario: e.target.value })}
              autoComplete="off"
            />
          </div>
          <div className="field">
            <label htmlFor="monto">Monto (COP)</label>
            <input
              id="monto"
              type="number"
              min="0"
              step="1000"
              value={form.monto}
              onChange={(e) => setForm({ ...form, monto: e.target.value })}
            />
          </div>
          <div className="field">
            <label htmlFor="canal">Canal</label>
            <select id="canal" value={form.canal} onChange={(e) => setForm({ ...form, canal: e.target.value as Canal })}>
              <option value="Email">Email</option>
              <option value="SMS">SMS</option>
              <option value="Push">Push</option>
            </select>
          </div>
          <div className="field">
            <label htmlFor="estado">Estado</label>
            <select id="estado" value={form.estado} onChange={(e) => setForm({ ...form, estado: e.target.value as Estado })}>
              <option value="Programada">Programada</option>
              <option value="Enviada">Enviada</option>
              <option value="Fallida">Fallida</option>
            </select>
          </div>
          <div className="field">
            <label htmlFor="fecha">Fecha</label>
            <input id="fecha" type="date" value={form.fecha} onChange={(e) => setForm({ ...form, fecha: e.target.value })} />
          </div>
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
          {errorForm && (
            <p className="error-text" role="alert">
              {errorForm}
            </p>
          )}
        </form>
        <p role="status" className="accion-status">
          {mensajeAccion}
        </p>
      </section>

      <section className="panel" aria-labelledby="lista-titulo">
        <div className="lista-header">
          <h2 id="lista-titulo">Notificaciones registradas</h2>
          <div className="filtros">
            <div className="field">
              <label htmlFor="busqueda">Buscar por destinatario</label>
              <input
                id="busqueda"
                type="search"
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                placeholder="Ej. Ana Torres"
              />
            </div>
            <div className="field">
              <label htmlFor="filtro-estado">Filtrar por estado</label>
              <select id="filtro-estado" value={filtroEstado} onChange={(e) => setFiltroEstado(e.target.value as 'Todas' | Estado)}>
                <option value="Todas">Todas</option>
                <option value="Programada">Programada</option>
                <option value="Enviada">Enviada</option>
                <option value="Fallida">Fallida</option>
              </select>
            </div>
          </div>
        </div>

        {listaFiltrada.length === 0 ? (
          <p className="estado-vacio">No hay notificaciones que coincidan con la búsqueda.</p>
        ) : (
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th scope="col">Destinatario</th>
                  <th scope="col">Monto</th>
                  <th scope="col">Canal</th>
                  <th scope="col">Estado</th>
                  <th scope="col">Fecha</th>
                  <th scope="col">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {listaFiltrada.map((n) => (
                  <tr key={n.id}>
                    <td>{n.destinatario}</td>
                    <td className="num">{formatoMonto.format(n.monto)}</td>
                    <td>{n.canal}</td>
                    <td>
                      <span className={`badge badge-${n.estado.toLowerCase()}`}>{n.estado}</span>
                    </td>
                    <td>{n.fecha}</td>
                    <td className="acciones">
                      <button type="button" className="btn btn-ghost" onClick={() => iniciarEdicion(n)}>
                        Editar
                      </button>
                      <button type="button" className="btn btn-danger" onClick={() => pedirEliminar(n)}>
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

      {pendienteEliminar && (
        <div className="dialog-backdrop" role="presentation">
          <div className="dialog" role="alertdialog" aria-modal="true" aria-labelledby="confirmar-titulo">
            <h2 id="confirmar-titulo">Confirmar eliminación</h2>
            <p>
              ¿Eliminar la notificación de <strong>{pendienteEliminar.destinatario}</strong>? Esta acción no se puede deshacer.
            </p>
            <div className="dialog-actions">
              <button type="button" className="btn btn-ghost" onClick={cancelarEliminar}>
                Cancelar
              </button>
              <button type="button" className="btn btn-danger" onClick={confirmarEliminar}>
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
