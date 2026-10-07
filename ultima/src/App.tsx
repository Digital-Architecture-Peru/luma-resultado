import { useMemo, useState } from 'react';

type Canal = 'Email' | 'SMS' | 'Push';
type Evento =
  | 'Saldo bajo'
  | 'Depósito recibido'
  | 'Pago programado'
  | 'Intento de acceso';

interface ReglaNotificacion {
  id: string;
  cuentaAlias: string;
  cuentaNumero: string;
  evento: Evento;
  canal: Canal;
  umbral?: number;
  activa: boolean;
}

interface FormState {
  cuentaAlias: string;
  cuentaNumero: string;
  evento: Evento;
  canal: Canal;
  umbral: string;
  activa: boolean;
}

const EVENTOS: Evento[] = [
  'Saldo bajo',
  'Depósito recibido',
  'Pago programado',
  'Intento de acceso',
];
const CANALES: Canal[] = ['Email', 'SMS', 'Push'];

const DATOS_INICIALES: ReglaNotificacion[] = [
  {
    id: 'r1',
    cuentaAlias: 'Cuenta Nómina',
    cuentaNumero: '**** 4521',
    evento: 'Saldo bajo',
    canal: 'Email',
    umbral: 50000,
    activa: true,
  },
  {
    id: 'r2',
    cuentaAlias: 'Cuenta Ahorros',
    cuentaNumero: '**** 8830',
    evento: 'Depósito recibido',
    canal: 'Push',
    activa: true,
  },
  {
    id: 'r3',
    cuentaAlias: 'Cuenta Nómina',
    cuentaNumero: '**** 4521',
    evento: 'Intento de acceso',
    canal: 'SMS',
    activa: false,
  },
];

const FORM_VACIO: FormState = {
  cuentaAlias: '',
  cuentaNumero: '',
  evento: 'Saldo bajo',
  canal: 'Email',
  umbral: '',
  activa: true,
};

let contadorId = DATOS_INICIALES.length;
function nuevoId(): string {
  contadorId += 1;
  return `r${contadorId}`;
}

export default function App() {
  const [reglas, setReglas] = useState<ReglaNotificacion[]>(DATOS_INICIALES);
  const [busqueda, setBusqueda] = useState('');
  const [form, setForm] = useState<FormState>(FORM_VACIO);
  const [editandoId, setEditandoId] = useState<string | null>(null);
  const [confirmandoId, setConfirmandoId] = useState<string | null>(null);
  const [errorForm, setErrorForm] = useState<string | null>(null);
  const [mensajeLista, setMensajeLista] = useState<string>('');
  const [estadoPrueba, setEstadoPrueba] = useState<string>('');

  const reglasFiltradas = useMemo(() => {
    const termino = busqueda.trim().toLowerCase();
    if (!termino) return reglas;
    return reglas.filter((r) =>
      [r.cuentaAlias, r.cuentaNumero, r.evento, r.canal]
        .join(' ')
        .toLowerCase()
        .includes(termino)
    );
  }, [reglas, busqueda]);

  function manejarProbarCapacidad() {
    setEstadoPrueba(
      `Notificación de Cuentas: prueba enviada correctamente a ${reglas.filter((r) => r.activa).length} regla(s) activa(s).`
    );
  }

  function limpiarFormulario() {
    setForm(FORM_VACIO);
    setEditandoId(null);
    setErrorForm(null);
  }

  function validarFormulario(f: FormState): string | null {
    if (!f.cuentaAlias.trim()) return 'El alias de la cuenta es obligatorio.';
    if (!f.cuentaNumero.trim()) return 'El número de cuenta es obligatorio.';
    if (f.umbral.trim() && Number.isNaN(Number(f.umbral))) {
      return 'El umbral debe ser un número válido.';
    }
    return null;
  }

  function manejarEnviarFormulario(e: React.FormEvent) {
    e.preventDefault();
    const error = validarFormulario(form);
    if (error) {
      setErrorForm(error);
      return;
    }
    const umbralNumero = form.umbral.trim() ? Number(form.umbral) : undefined;
    if (editandoId) {
      setReglas((prev) =>
        prev.map((r) =>
          r.id === editandoId
            ? {
                ...r,
                cuentaAlias: form.cuentaAlias.trim(),
                cuentaNumero: form.cuentaNumero.trim(),
                evento: form.evento,
                canal: form.canal,
                umbral: umbralNumero,
                activa: form.activa,
              }
            : r
        )
      );
      setMensajeLista(`Regla de "${form.cuentaAlias.trim()}" actualizada.`);
    } else {
      const nueva: ReglaNotificacion = {
        id: nuevoId(),
        cuentaAlias: form.cuentaAlias.trim(),
        cuentaNumero: form.cuentaNumero.trim(),
        evento: form.evento,
        canal: form.canal,
        umbral: umbralNumero,
        activa: form.activa,
      };
      setReglas((prev) => [...prev, nueva]);
      setMensajeLista(`Regla de "${nueva.cuentaAlias}" creada.`);
    }
    limpiarFormulario();
  }

  function manejarEditar(regla: ReglaNotificacion) {
    setEditandoId(regla.id);
    setConfirmandoId(null);
    setErrorForm(null);
    setForm({
      cuentaAlias: regla.cuentaAlias,
      cuentaNumero: regla.cuentaNumero,
      evento: regla.evento,
      canal: regla.canal,
      umbral: regla.umbral != null ? String(regla.umbral) : '',
      activa: regla.activa,
    });
  }

  function manejarAlternarActiva(id: string) {
    setReglas((prev) =>
      prev.map((r) => (r.id === id ? { ...r, activa: !r.activa } : r))
    );
  }

  function pedirConfirmacionEliminar(id: string) {
    setConfirmandoId(id);
  }

  function cancelarEliminar() {
    setConfirmandoId(null);
  }

  function confirmarEliminar(id: string) {
    const regla = reglas.find((r) => r.id === id);
    setReglas((prev) => prev.filter((r) => r.id !== id));
    setConfirmandoId(null);
    if (editandoId === id) limpiarFormulario();
    setMensajeLista(
      regla ? `Regla de "${regla.cuentaAlias}" eliminada.` : 'Regla eliminada.'
    );
  }

  return (
    <main className="app-shell">
      <header className="app-header">
        <div>
          <h1>Notificación de Cuentas</h1>
          <p className="app-subtitle">
            Banca por Internet · Configuración de alertas sobre tus cuentas
          </p>
        </div>
        <button
          type="button"
          className="btn btn-primary"
          onClick={manejarProbarCapacidad}
        >
          Probar capacidad
        </button>
      </header>

      <p role="status" className="status-banner" aria-live="polite">
        {estadoPrueba}
      </p>

      <section className="panel" aria-labelledby="titulo-form">
        <h2 id="titulo-form">
          {editandoId ? 'Editar regla de notificación' : 'Nueva regla de notificación'}
        </h2>
        <form onSubmit={manejarEnviarFormulario} className="form-grid">
          <div className="field">
            <label htmlFor="alias">Alias de la cuenta</label>
            <input
              id="alias"
              type="text"
              value={form.cuentaAlias}
              onChange={(e) => setForm({ ...form, cuentaAlias: e.target.value })}
              placeholder="Cuenta Nómina"
            />
          </div>
          <div className="field">
            <label htmlFor="numero">Número de cuenta</label>
            <input
              id="numero"
              type="text"
              value={form.cuentaNumero}
              onChange={(e) => setForm({ ...form, cuentaNumero: e.target.value })}
              placeholder="**** 1234"
            />
          </div>
          <div className="field">
            <label htmlFor="evento">Evento</label>
            <select
              id="evento"
              value={form.evento}
              onChange={(e) => setForm({ ...form, evento: e.target.value as Evento })}
            >
              {EVENTOS.map((ev) => (
                <option key={ev} value={ev}>
                  {ev}
                </option>
              ))}
            </select>
          </div>
          <div className="field">
            <label htmlFor="canal">Canal</label>
            <select
              id="canal"
              value={form.canal}
              onChange={(e) => setForm({ ...form, canal: e.target.value as Canal })}
            >
              {CANALES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
          <div className="field">
            <label htmlFor="umbral">Umbral (opcional)</label>
            <input
              id="umbral"
              type="text"
              inputMode="numeric"
              value={form.umbral}
              onChange={(e) => setForm({ ...form, umbral: e.target.value })}
              placeholder="Ej. 50000"
            />
          </div>
          <div className="field field-checkbox">
            <label htmlFor="activa">
              <input
                id="activa"
                type="checkbox"
                checked={form.activa}
                onChange={(e) => setForm({ ...form, activa: e.target.checked })}
              />
              Regla activa
            </label>
          </div>

          {errorForm && (
            <p className="error-text" role="alert">
              {errorForm}
            </p>
          )}

          <div className="form-actions">
            <button type="submit" className="btn btn-primary">
              {editandoId ? 'Guardar cambios' : 'Crear regla'}
            </button>
            {editandoId && (
              <button type="button" className="btn btn-ghost" onClick={limpiarFormulario}>
                Cancelar edición
              </button>
            )}
          </div>
        </form>
      </section>

      <section className="panel" aria-labelledby="titulo-lista">
        <div className="panel-header">
          <h2 id="titulo-lista">Reglas configuradas</h2>
          <div className="field search-field">
            <label htmlFor="buscar">Buscar</label>
            <input
              id="buscar"
              type="search"
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              placeholder="Cuenta, evento o canal"
            />
          </div>
        </div>

        <p role="status" aria-live="polite" className="muted-status">
          {mensajeLista}
        </p>

        {reglasFiltradas.length === 0 ? (
          <p className="empty-state">No hay reglas que coincidan con la búsqueda.</p>
        ) : (
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Cuenta</th>
                  <th>Evento</th>
                  <th>Canal</th>
                  <th>Umbral</th>
                  <th>Estado</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {reglasFiltradas.map((r) => (
                  <tr key={r.id}>
                    <td>
                      <div>{r.cuentaAlias}</div>
                      <div className="muted">{r.cuentaNumero}</div>
                    </td>
                    <td>{r.evento}</td>
                    <td>{r.canal}</td>
                    <td className="num-cell">{r.umbral != null ? r.umbral.toLocaleString('es-CO') : '—'}</td>
                    <td>
                      <button
                        type="button"
                        className={`badge ${r.activa ? 'badge-success' : 'badge-muted'}`}
                        onClick={() => manejarAlternarActiva(r.id)}
                        aria-pressed={r.activa}
                      >
                        {r.activa ? 'Activa' : 'Inactiva'}
                      </button>
                    </td>
                    <td className="acciones-cell">
                      <button type="button" className="btn btn-secondary" onClick={() => manejarEditar(r)}>
                        Editar
                      </button>
                      {confirmandoId === r.id ? (
                        <span className="confirm-inline">
                          <span>¿Eliminar?</span>
                          <button
                            type="button"
                            className="btn btn-danger"
                            onClick={() => confirmarEliminar(r.id)}
                          >
                            Sí, eliminar
                          </button>
                          <button type="button" className="btn btn-ghost" onClick={cancelarEliminar}>
                            Cancelar
                          </button>
                        </span>
                      ) : (
                        <button
                          type="button"
                          className="btn btn-ghost"
                          onClick={() => pedirConfirmacionEliminar(r.id)}
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
    </main>
  );
}
