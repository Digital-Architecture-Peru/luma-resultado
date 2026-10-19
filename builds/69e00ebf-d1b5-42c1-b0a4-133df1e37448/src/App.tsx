import { useMemo, useState } from 'react';

type CanalNotificacion = 'Push' | 'SMS' | 'Email';
type EstadoNotificacion = 'Pendiente' | 'Enviada' | 'Fallida';

interface NotificacionTarjeta {
  id: string;
  tarjeta: string;
  titular: string;
  mensaje: string;
  canal: CanalNotificacion;
  estado: EstadoNotificacion;
  fecha: string;
}

let nextId = 5;

const DATOS_INICIALES: NotificacionTarjeta[] = [
  {
    id: 't1',
    tarjeta: '**** 4821',
    titular: 'María Fernández',
    mensaje: 'Compra aprobada por $120.000 en Supermercado La Economía',
    canal: 'Push',
    estado: 'Enviada',
    fecha: '2026-10-18 09:12',
  },
  {
    id: 't2',
    tarjeta: '**** 2290',
    titular: 'Jorge Ramírez',
    mensaje: 'Pago mínimo disponible, vence en 3 días',
    canal: 'SMS',
    estado: 'Pendiente',
    fecha: '2026-10-18 14:40',
  },
  {
    id: 't3',
    tarjeta: '**** 7753',
    titular: 'Lucía Gómez',
    mensaje: 'Intento de compra rechazado por fondos insuficientes',
    canal: 'Email',
    estado: 'Fallida',
    fecha: '2026-10-19 08:03',
  },
  {
    id: 't4',
    tarjeta: '**** 3014',
    titular: 'Pedro Salazar',
    mensaje: 'Tarjeta bloqueada temporalmente por seguridad',
    canal: 'Push',
    estado: 'Enviada',
    fecha: '2026-10-19 10:55',
  },
];

const CANALES: CanalNotificacion[] = ['Push', 'SMS', 'Email'];
const ESTADOS: EstadoNotificacion[] = ['Pendiente', 'Enviada', 'Fallida'];

function formatearFechaActual(): string {
  const ahora = new Date();
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${ahora.getFullYear()}-${pad(ahora.getMonth() + 1)}-${pad(ahora.getDate())} ${pad(
    ahora.getHours(),
  )}:${pad(ahora.getMinutes())}`;
}

interface FormularioNotificacion {
  tarjeta: string;
  titular: string;
  mensaje: string;
  canal: CanalNotificacion;
  estado: EstadoNotificacion;
}

const FORMULARIO_VACIO: FormularioNotificacion = {
  tarjeta: '',
  titular: '',
  mensaje: '',
  canal: 'Push',
  estado: 'Pendiente',
};

export default function App() {
  const [notificaciones, setNotificaciones] = useState<NotificacionTarjeta[]>(DATOS_INICIALES);
  const [busqueda, setBusqueda] = useState('');
  const [filtroEstado, setFiltroEstado] = useState<EstadoNotificacion | 'Todos'>('Todos');
  const [formulario, setFormulario] = useState<FormularioNotificacion>(FORMULARIO_VACIO);
  const [editandoId, setEditandoId] = useState<string | null>(null);
  const [pendienteBorrarId, setPendienteBorrarId] = useState<string | null>(null);
  const [mensajeAccion, setMensajeAccion] = useState('');
  const [errorFormulario, setErrorFormulario] = useState('');
  const [resultadoCapacidad, setResultadoCapacidad] = useState('');

  const listaFiltrada = useMemo(() => {
    const termino = busqueda.trim().toLowerCase();
    return notificaciones.filter((n) => {
      const coincideTermino =
        termino.length === 0 ||
        n.tarjeta.toLowerCase().includes(termino) ||
        n.titular.toLowerCase().includes(termino) ||
        n.mensaje.toLowerCase().includes(termino);
      const coincideEstado = filtroEstado === 'Todos' || n.estado === filtroEstado;
      return coincideTermino && coincideEstado;
    });
  }, [notificaciones, busqueda, filtroEstado]);

  function actualizarCampo<K extends keyof FormularioNotificacion>(
    campo: K,
    valor: FormularioNotificacion[K],
  ) {
    setFormulario((previo) => ({ ...previo, [campo]: valor }));
  }

  function limpiarFormulario() {
    setFormulario(FORMULARIO_VACIO);
    setEditandoId(null);
    setErrorFormulario('');
  }

  function manejarEnviarFormulario(evento: React.FormEvent) {
    evento.preventDefault();
    const tarjeta = formulario.tarjeta.trim();
    const titular = formulario.titular.trim();
    const mensaje = formulario.mensaje.trim();

    if (!tarjeta || !titular || !mensaje) {
      setErrorFormulario('Completa tarjeta, titular y mensaje antes de guardar.');
      return;
    }

    if (editandoId) {
      setNotificaciones((previo) =>
        previo.map((n) =>
          n.id === editandoId
            ? { ...n, tarjeta, titular, mensaje, canal: formulario.canal, estado: formulario.estado }
            : n,
        ),
      );
      setMensajeAccion(`Notificación de ${titular} actualizada.`);
    } else {
      const nueva: NotificacionTarjeta = {
        id: `t${nextId++}`,
        tarjeta,
        titular,
        mensaje,
        canal: formulario.canal,
        estado: formulario.estado,
        fecha: formatearFechaActual(),
      };
      setNotificaciones((previo) => [nueva, ...previo]);
      setMensajeAccion(`Notificación creada para ${titular}.`);
    }
    limpiarFormulario();
  }

  function iniciarEdicion(notificacion: NotificacionTarjeta) {
    setEditandoId(notificacion.id);
    setFormulario({
      tarjeta: notificacion.tarjeta,
      titular: notificacion.titular,
      mensaje: notificacion.mensaje,
      canal: notificacion.canal,
      estado: notificacion.estado,
    });
    setErrorFormulario('');
    setMensajeAccion('');
  }

  function pedirConfirmacionBorrado(id: string) {
    setPendienteBorrarId(id);
  }

  function cancelarBorrado() {
    setPendienteBorrarId(null);
  }

  function confirmarBorrado(id: string) {
    const objetivo = notificaciones.find((n) => n.id === id);
    setNotificaciones((previo) => previo.filter((n) => n.id !== id));
    setPendienteBorrarId(null);
    if (editandoId === id) {
      limpiarFormulario();
    }
    setMensajeAccion(`Notificación de ${objetivo?.titular ?? 'la tarjeta'} eliminada.`);
  }

  function reenviarNotificacion(id: string) {
    setNotificaciones((previo) =>
      previo.map((n) =>
        n.id === id ? { ...n, estado: 'Enviada', fecha: formatearFechaActual() } : n,
      ),
    );
    const objetivo = notificaciones.find((n) => n.id === id);
    setMensajeAccion(`Notificación reenviada a ${objetivo?.titular ?? 'titular'}.`);
  }

  function probarCapacidad() {
    setResultadoCapacidad('Notificación de Tarjetas');
  }

  return (
    <main className="app-shell">
      <header className="app-header">
        <div className="app-header__texto">
          <p className="app-header__kicker">Banca por Internet · Tarjetas</p>
          <h1>Notificación de Tarjetas</h1>
          <p className="app-header__descripcion">
            Gestiona, busca y confirma el envío de notificaciones ficticias asociadas a
            movimientos de tarjetas. Datos de demostración en memoria, sin persistencia.
          </p>
        </div>
        <div className="app-header__accion">
          <button type="button" className="boton boton--primario" onClick={probarCapacidad}>
            Probar capacidad
          </button>
          <p role="status" className="estado-capacidad" aria-live="polite">
            {resultadoCapacidad}
          </p>
        </div>
      </header>

      <section className="panel" aria-labelledby="titulo-formulario">
        <h2 id="titulo-formulario">{editandoId ? 'Editar notificación' : 'Nueva notificación'}</h2>
        <form className="formulario" onSubmit={manejarEnviarFormulario} noValidate>
          <div className="campo">
            <label htmlFor="campo-tarjeta">Tarjeta</label>
            <input
              id="campo-tarjeta"
              type="text"
              placeholder="**** 1234"
              value={formulario.tarjeta}
              onChange={(e) => actualizarCampo('tarjeta', e.target.value)}
            />
          </div>
          <div className="campo">
            <label htmlFor="campo-titular">Titular</label>
            <input
              id="campo-titular"
              type="text"
              placeholder="Nombre del titular"
              value={formulario.titular}
              onChange={(e) => actualizarCampo('titular', e.target.value)}
            />
          </div>
          <div className="campo campo--ancho">
            <label htmlFor="campo-mensaje">Mensaje</label>
            <textarea
              id="campo-mensaje"
              rows={2}
              placeholder="Detalle del evento a notificar"
              value={formulario.mensaje}
              onChange={(e) => actualizarCampo('mensaje', e.target.value)}
            />
          </div>
          <div className="campo">
            <label htmlFor="campo-canal">Canal</label>
            <select
              id="campo-canal"
              value={formulario.canal}
              onChange={(e) => actualizarCampo('canal', e.target.value as CanalNotificacion)}
            >
              {CANALES.map((canal) => (
                <option key={canal} value={canal}>
                  {canal}
                </option>
              ))}
            </select>
          </div>
          <div className="campo">
            <label htmlFor="campo-estado">Estado</label>
            <select
              id="campo-estado"
              value={formulario.estado}
              onChange={(e) => actualizarCampo('estado', e.target.value as EstadoNotificacion)}
            >
              {ESTADOS.map((estado) => (
                <option key={estado} value={estado}>
                  {estado}
                </option>
              ))}
            </select>
          </div>

          {errorFormulario && (
            <p className="mensaje-error" role="alert">
              {errorFormulario}
            </p>
          )}

          <div className="formulario__acciones">
            <button type="submit" className="boton boton--primario">
              {editandoId ? 'Guardar cambios' : 'Crear notificación'}
            </button>
            {editandoId && (
              <button type="button" className="boton boton--fantasma" onClick={limpiarFormulario}>
                Cancelar edición
              </button>
            )}
          </div>
        </form>
      </section>

      <section className="panel" aria-labelledby="titulo-lista">
        <div className="panel__encabezado">
          <h2 id="titulo-lista">Notificaciones registradas</h2>
          {mensajeAccion && (
            <p role="status" className="mensaje-accion" aria-live="polite">
              {mensajeAccion}
            </p>
          )}
        </div>

        <div className="controles-busqueda">
          <div className="campo campo--buscar">
            <label htmlFor="campo-busqueda">Buscar</label>
            <input
              id="campo-busqueda"
              type="search"
              placeholder="Tarjeta, titular o mensaje"
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
            />
          </div>
          <div className="campo">
            <label htmlFor="campo-filtro-estado">Filtrar por estado</label>
            <select
              id="campo-filtro-estado"
              value={filtroEstado}
              onChange={(e) => setFiltroEstado(e.target.value as EstadoNotificacion | 'Todos')}
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

        {listaFiltrada.length === 0 ? (
          <p className="estado-vacio">No hay notificaciones que coincidan con la búsqueda.</p>
        ) : (
          <ul className="lista-notificaciones">
            {listaFiltrada.map((n) => (
              <li key={n.id} className="tarjeta-notificacion">
                <div className="tarjeta-notificacion__cabecera">
                  <div>
                    <p className="tarjeta-notificacion__titular">{n.titular}</p>
                    <p className="tarjeta-notificacion__tarjeta">{n.tarjeta}</p>
                  </div>
                  <span className={`insignia insignia--${n.estado.toLowerCase()}`}>{n.estado}</span>
                </div>
                <p className="tarjeta-notificacion__mensaje">{n.mensaje}</p>
                <p className="tarjeta-notificacion__meta">
                  Canal: {n.canal} · {n.fecha}
                </p>

                {pendienteBorrarId === n.id ? (
                  <div className="confirmacion-borrado">
                    <p role="alert">¿Eliminar esta notificación de {n.titular}?</p>
                    <div className="confirmacion-borrado__acciones">
                      <button
                        type="button"
                        className="boton boton--peligro"
                        onClick={() => confirmarBorrado(n.id)}
                      >
                        Sí, eliminar
                      </button>
                      <button type="button" className="boton boton--fantasma" onClick={cancelarBorrado}>
                        Cancelar
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="tarjeta-notificacion__acciones">
                    <button
                      type="button"
                      className="boton boton--secundario"
                      onClick={() => reenviarNotificacion(n.id)}
                      disabled={n.estado === 'Enviada'}
                    >
                      Reenviar
                    </button>
                    <button
                      type="button"
                      className="boton boton--secundario"
                      onClick={() => iniciarEdicion(n)}
                    >
                      Editar
                    </button>
                    <button
                      type="button"
                      className="boton boton--peligro"
                      onClick={() => pedirConfirmacionBorrado(n.id)}
                    >
                      Eliminar
                    </button>
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  );
}
