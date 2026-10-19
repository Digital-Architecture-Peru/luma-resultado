import { useMemo, useState } from 'react';

type Canal = 'Email' | 'SMS' | 'Push';
type Estado = 'Pendiente' | 'Enviada' | 'Fallida';

interface Notificacion {
  id: string;
  cuenta: string;
  titular: string;
  canal: Canal;
  mensaje: string;
  estado: Estado;
  creada: string;
}

interface FormState {
  cuenta: string;
  titular: string;
  canal: Canal;
  mensaje: string;
}

const CANALES: Canal[] = ['Email', 'SMS', 'Push'];

function nuevoId(): string {
  return `ntf-${Math.random().toString(36).slice(2, 9)}`;
}

function horaActual(): string {
  return new Date().toLocaleTimeString('es', { hour: '2-digit', minute: '2-digit' });
}

const SEED: Notificacion[] = [
  {
    id: nuevoId(),
    cuenta: 'CTA-10234',
    titular: 'Marta Reyes',
    canal: 'Email',
    mensaje: 'Tu saldo disponible bajó de 100.000.',
    estado: 'Enviada',
    creada: horaActual(),
  },
  {
    id: nuevoId(),
    cuenta: 'CTA-55821',
    titular: 'Jorge Peña',
    canal: 'SMS',
    mensaje: 'Se registró un depósito de 250.000.',
    estado: 'Pendiente',
    creada: horaActual(),
  },
  {
    id: nuevoId(),
    cuenta: 'CTA-77410',
    titular: 'Ana Lucero',
    canal: 'Push',
    mensaje: 'Tu tarjeta asociada fue bloqueada temporalmente.',
    estado: 'Fallida',
    creada: horaActual(),
  },
];

const FORM_VACIO: FormState = { cuenta: '', titular: '', canal: 'Email', mensaje: '' };

export default function App() {
  const [notificaciones, setNotificaciones] = useState<Notificacion[]>(SEED);
  const [form, setForm] = useState<FormState>(FORM_VACIO);
  const [editandoId, setEditandoId] = useState<string | null>(null);
  const [busqueda, setBusqueda] = useState('');
  const [pendienteBorrar, setPendienteBorrar] = useState<string | null>(null);
  const [mensajeEstado, setMensajeEstado] = useState('');
  const [capacidadProbada, setCapacidadProbada] = useState('');
  const [errorForm, setErrorForm] = useState('');

  const filtradas = useMemo(() => {
    const q = busqueda.trim().toLowerCase();
    if (!q) return notificaciones;
    return notificaciones.filter((n) =>
      [n.cuenta, n.titular, n.canal, n.mensaje, n.estado].some((campo) =>
        campo.toLowerCase().includes(q),
      ),
    );
  }, [notificaciones, busqueda]);

  function anunciar(texto: string) {
    setMensajeEstado(texto);
  }

  function limpiarFormulario() {
    setForm(FORM_VACIO);
    setEditandoId(null);
    setErrorForm('');
  }

  function manejarEnvioFormulario(evento: React.FormEvent<HTMLFormElement>) {
    evento.preventDefault();
    const cuenta = form.cuenta.trim();
    const titular = form.titular.trim();
    const mensaje = form.mensaje.trim();

    if (!cuenta || !titular || !mensaje) {
      setErrorForm('Completa cuenta, titular y mensaje antes de guardar.');
      return;
    }

    if (editandoId) {
      setNotificaciones((previas) =>
        previas.map((n) =>
          n.id === editandoId ? { ...n, cuenta, titular, canal: form.canal, mensaje } : n,
        ),
      );
      anunciar(`Notificación de la cuenta ${cuenta} actualizada.`);
    } else {
      const creada: Notificacion = {
        id: nuevoId(),
        cuenta,
        titular,
        canal: form.canal,
        mensaje,
        estado: 'Pendiente',
        creada: horaActual(),
      };
      setNotificaciones((previas) => [creada, ...previas]);
      anunciar(`Notificación creada para la cuenta ${cuenta}.`);
    }
    limpiarFormulario();
  }

  function editar(n: Notificacion) {
    setForm({ cuenta: n.cuenta, titular: n.titular, canal: n.canal, mensaje: n.mensaje });
    setEditandoId(n.id);
    setErrorForm('');
  }

  function pedirConfirmacionBorrado(id: string) {
    setPendienteBorrar(id);
  }

  function cancelarBorrado() {
    setPendienteBorrar(null);
  }

  function confirmarBorrado() {
    if (!pendienteBorrar) return;
    const objetivo = notificaciones.find((n) => n.id === pendienteBorrar);
    setNotificaciones((previas) => previas.filter((n) => n.id !== pendienteBorrar));
    if (editandoId === pendienteBorrar) limpiarFormulario();
    setPendienteBorrar(null);
    anunciar(`Notificación de la cuenta ${objetivo?.cuenta ?? ''} eliminada.`);
  }

  function marcarEnviada(id: string) {
    setNotificaciones((previas) =>
      previas.map((n) => (n.id === id ? { ...n, estado: 'Enviada' as Estado } : n)),
    );
    anunciar('Notificación marcada como enviada.');
  }

  function probarCapacidad() {
    setCapacidadProbada('Notificación de Cuentas');
  }

  return (
    <main className="app-shell">
      <header className="app-header">
        <p className="app-kicker">Banca por Internet · Cuentas</p>
        <h1>Notificación de Cuentas</h1>
        <p className="app-subtitle">
          Administra en memoria las notificaciones enviadas a los titulares de cuenta: crea,
          edita, busca, confirma el envío o elimina con confirmación explícita.
        </p>
        <div className="probar-capacidad">
          <button type="button" className="btn btn-primary" onClick={probarCapacidad}>
            Probar capacidad
          </button>
          <span role="status" aria-live="polite" className="capacidad-resultado">
            {capacidadProbada}
          </span>
        </div>
      </header>

      <section className="panel" aria-labelledby="form-titulo">
        <h2 id="form-titulo">{editandoId ? 'Editar notificación' : 'Nueva notificación'}</h2>
        <form onSubmit={manejarEnvioFormulario} className="formulario" noValidate>
          <div className="campo">
            <label htmlFor="cuenta">Número de cuenta</label>
            <input
              id="cuenta"
              name="cuenta"
              type="text"
              value={form.cuenta}
              placeholder="CTA-00000"
              onChange={(e) => setForm((f) => ({ ...f, cuenta: e.target.value }))}
            />
          </div>
          <div className="campo">
            <label htmlFor="titular">Titular</label>
            <input
              id="titular"
              name="titular"
              type="text"
              value={form.titular}
              placeholder="Nombre del titular"
              onChange={(e) => setForm((f) => ({ ...f, titular: e.target.value }))}
            />
          </div>
          <div className="campo">
            <label htmlFor="canal">Canal</label>
            <select
              id="canal"
              name="canal"
              value={form.canal}
              onChange={(e) => setForm((f) => ({ ...f, canal: e.target.value as Canal }))}
            >
              {CANALES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
          <div className="campo campo-ancho">
            <label htmlFor="mensaje">Mensaje</label>
            <textarea
              id="mensaje"
              name="mensaje"
              rows={2}
              value={form.mensaje}
              placeholder="Texto de la notificación"
              onChange={(e) => setForm((f) => ({ ...f, mensaje: e.target.value }))}
            />
          </div>
          {errorForm && (
            <p className="error-texto" role="alert">
              {errorForm}
            </p>
          )}
          <div className="acciones-formulario">
            <button type="submit" className="btn btn-primary">
              {editandoId ? 'Guardar cambios' : 'Crear notificación'}
            </button>
            {editandoId && (
              <button type="button" className="btn btn-fantasma" onClick={limpiarFormulario}>
                Cancelar edición
              </button>
            )}
          </div>
        </form>
      </section>

      <section className="panel" aria-labelledby="lista-titulo">
        <div className="lista-encabezado">
          <h2 id="lista-titulo">Notificaciones registradas</h2>
          <div className="campo campo-busqueda">
            <label htmlFor="busqueda">Buscar</label>
            <input
              id="busqueda"
              type="search"
              value={busqueda}
              placeholder="Cuenta, titular, canal o estado"
              onChange={(e) => setBusqueda(e.target.value)}
            />
          </div>
        </div>

        {filtradas.length === 0 ? (
          <p className="estado-vacio">No hay notificaciones que coincidan con la búsqueda.</p>
        ) : (
          <div className="tabla-envoltorio">
            <table className="tabla">
              <thead>
                <tr>
                  <th scope="col">Cuenta</th>
                  <th scope="col">Titular</th>
                  <th scope="col">Canal</th>
                  <th scope="col">Mensaje</th>
                  <th scope="col">Estado</th>
                  <th scope="col">Hora</th>
                  <th scope="col">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filtradas.map((n) => (
                  <tr key={n.id}>
                    <td>{n.cuenta}</td>
                    <td>{n.titular}</td>
                    <td>{n.canal}</td>
                    <td className="celda-mensaje">{n.mensaje}</td>
                    <td>
                      <span className={`badge badge-${n.estado.toLowerCase()}`}>{n.estado}</span>
                    </td>
                    <td className="celda-numerica">{n.creada}</td>
                    <td className="celda-acciones">
                      {n.estado !== 'Enviada' && (
                        <button
                          type="button"
                          className="btn btn-secundario"
                          onClick={() => marcarEnviada(n.id)}
                        >
                          Marcar enviada
                        </button>
                      )}
                      <button type="button" className="btn btn-fantasma" onClick={() => editar(n)}>
                        Editar
                      </button>
                      {pendienteBorrar === n.id ? (
                        <span className="confirmacion-inline">
                          <span>¿Eliminar?</span>
                          <button
                            type="button"
                            className="btn btn-peligro"
                            onClick={confirmarBorrado}
                          >
                            Sí, eliminar
                          </button>
                          <button type="button" className="btn btn-fantasma" onClick={cancelarBorrado}>
                            Cancelar
                          </button>
                        </span>
                      ) : (
                        <button
                          type="button"
                          className="btn btn-peligro"
                          onClick={() => pedirConfirmacionBorrado(n.id)}
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

      <p role="status" aria-live="polite" className="mensaje-estado">
        {mensajeEstado}
      </p>
    </main>
  );
}
