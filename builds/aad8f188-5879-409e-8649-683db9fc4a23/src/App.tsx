import { useState, useMemo } from 'react';

type Cliente = {
  id: number;
  nombre: string;
  email: string;
  telefono: string;
  segmento: string;
};

const CLIENTES_INICIALES: Cliente[] = [
  { id: 1, nombre: 'Ana Torres', email: 'ana.torres@example.com', telefono: '555-0101', segmento: 'Premium' },
  { id: 2, nombre: 'Luis Gómez', email: 'luis.gomez@example.com', telefono: '555-0102', segmento: 'Estándar' },
  { id: 3, nombre: 'María Rivas', email: 'maria.rivas@example.com', telefono: '555-0103', segmento: 'Premium' },
];

type FormState = {
  nombre: string;
  email: string;
  telefono: string;
  segmento: string;
};

const FORM_VACIO: FormState = { nombre: '', email: '', telefono: '', segmento: 'Estándar' };

type Errores = Partial<Record<keyof FormState, string>>;

export default function App() {
  const [clientes, setClientes] = useState<Cliente[]>(CLIENTES_INICIALES);
  const [form, setForm] = useState<FormState>(FORM_VACIO);
  const [errores, setErrores] = useState<Errores>({});
  const [editandoId, setEditandoId] = useState<number | null>(null);
  const [busqueda, setBusqueda] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [confirmarEliminarId, setConfirmarEliminarId] = useState<number | null>(null);
  const [capacidadTexto, setCapacidadTexto] = useState('');

  const clientesFiltrados = useMemo(() => {
    const q = busqueda.trim().toLowerCase();
    if (!q) return clientes;
    return clientes.filter(
      (c) =>
        c.nombre.toLowerCase().includes(q) ||
        c.email.toLowerCase().includes(q) ||
        c.segmento.toLowerCase().includes(q)
    );
  }, [clientes, busqueda]);

  function validar(f: FormState): Errores {
    const e: Errores = {};
    if (!f.nombre.trim()) e.nombre = 'El nombre es obligatorio.';
    if (!f.email.trim()) {
      e.email = 'El correo es obligatorio.';
    } else if (!/^\S+@\S+\.\S+$/.test(f.email)) {
      e.email = 'El correo no tiene un formato válido.';
    }
    if (!f.telefono.trim()) e.telefono = 'El teléfono es obligatorio.';
    return e;
  }

  function limpiarFormulario() {
    setForm(FORM_VACIO);
    setErrores({});
    setEditandoId(null);
  }

  function manejarEnviar(ev: React.FormEvent) {
    ev.preventDefault();
    const e = validar(form);
    setErrores(e);
    if (Object.keys(e).length > 0) {
      setMensaje('Revisa los campos marcados con error.');
      return;
    }
    if (editandoId !== null) {
      setClientes((prev) =>
        prev.map((c) => (c.id === editandoId ? { ...c, ...form } : c))
      );
      setMensaje(`Cliente "${form.nombre}" actualizado correctamente.`);
    } else {
      const nuevoId = clientes.length ? Math.max(...clientes.map((c) => c.id)) + 1 : 1;
      setClientes((prev) => [...prev, { id: nuevoId, ...form }]);
      setMensaje(`Cliente "${form.nombre}" creado correctamente.`);
    }
    limpiarFormulario();
  }

  function iniciarEdicion(c: Cliente) {
    setEditandoId(c.id);
    setForm({ nombre: c.nombre, email: c.email, telefono: c.telefono, segmento: c.segmento });
    setErrores({});
    setMensaje('');
  }

  function pedirConfirmacionEliminar(id: number) {
    setConfirmarEliminarId(id);
  }

  function cancelarEliminar() {
    setConfirmarEliminarId(null);
  }

  function confirmarEliminar(id: number) {
    const c = clientes.find((x) => x.id === id);
    setClientes((prev) => prev.filter((x) => x.id !== id));
    setConfirmarEliminarId(null);
    if (editandoId === id) limpiarFormulario();
    setMensaje(c ? `Cliente "${c.nombre}" eliminado.` : 'Cliente eliminado.');
  }

  function probarCapacidad() {
    setCapacidadTexto('Capacidad simulada');
  }

  return (
    <main className="app-shell">
      <header className="app-header">
        <h1>Gestión de Clientes</h1>
        <p className="app-subtitle">
          Formulario de Portal web · Dominio Clientes · Datos ficticios en memoria
        </p>
      </header>

      <section className="capacidad-panel" aria-labelledby="capacidad-titulo">
        <h2 id="capacidad-titulo">Capacidad de demostración</h2>
        <p>Valida rápidamente que la capacidad responde de forma interactiva.</p>
        <button type="button" className="btn btn-primary" onClick={probarCapacidad}>
          Probar capacidad
        </button>
        <p role="status" className="capacidad-resultado">
          {capacidadTexto}
        </p>
      </section>

      <section className="panel" aria-labelledby="form-titulo">
        <h2 id="form-titulo">{editandoId !== null ? 'Editar cliente' : 'Nuevo cliente'}</h2>
        <form onSubmit={manejarEnviar} noValidate className="form-grid">
          <div className="form-field">
            <label htmlFor="nombre">Nombre</label>
            <input
              id="nombre"
              type="text"
              value={form.nombre}
              onChange={(e) => setForm({ ...form, nombre: e.target.value })}
              aria-invalid={Boolean(errores.nombre)}
              aria-describedby={errores.nombre ? 'error-nombre' : undefined}
            />
            {errores.nombre && (
              <span id="error-nombre" className="form-error">
                {errores.nombre}
              </span>
            )}
          </div>

          <div className="form-field">
            <label htmlFor="email">Correo electrónico</label>
            <input
              id="email"
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              aria-invalid={Boolean(errores.email)}
              aria-describedby={errores.email ? 'error-email' : undefined}
            />
            {errores.email && (
              <span id="error-email" className="form-error">
                {errores.email}
              </span>
            )}
          </div>

          <div className="form-field">
            <label htmlFor="telefono">Teléfono</label>
            <input
              id="telefono"
              type="tel"
              value={form.telefono}
              onChange={(e) => setForm({ ...form, telefono: e.target.value })}
              aria-invalid={Boolean(errores.telefono)}
              aria-describedby={errores.telefono ? 'error-telefono' : undefined}
            />
            {errores.telefono && (
              <span id="error-telefono" className="form-error">
                {errores.telefono}
              </span>
            )}
          </div>

          <div className="form-field">
            <label htmlFor="segmento">Segmento</label>
            <select
              id="segmento"
              value={form.segmento}
              onChange={(e) => setForm({ ...form, segmento: e.target.value })}
            >
              <option value="Estándar">Estándar</option>
              <option value="Premium">Premium</option>
              <option value="Corporativo">Corporativo</option>
            </select>
          </div>

          <div className="form-actions">
            <button type="submit" className="btn btn-primary">
              {editandoId !== null ? 'Guardar cambios' : 'Crear cliente'}
            </button>
            {editandoId !== null && (
              <button type="button" className="btn btn-secondary" onClick={limpiarFormulario}>
                Cancelar edición
              </button>
            )}
          </div>
        </form>
        <p role="status" className="form-mensaje">
          {mensaje}
        </p>
      </section>

      <section className="panel" aria-labelledby="lista-titulo">
        <div className="panel-header">
          <h2 id="lista-titulo">Clientes registrados</h2>
          <div className="form-field busqueda-field">
            <label htmlFor="busqueda">Buscar</label>
            <input
              id="busqueda"
              type="search"
              placeholder="Nombre, correo o segmento"
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
            />
          </div>
        </div>

        {clientesFiltrados.length === 0 ? (
          <p className="estado-vacio">No se encontraron clientes con ese criterio.</p>
        ) : (
          <ul className="clientes-lista">
            {clientesFiltrados.map((c) => (
              <li key={c.id} className="cliente-card">
                <div className="cliente-info">
                  <strong>{c.nombre}</strong>
                  <span>{c.email}</span>
                  <span>{c.telefono}</span>
                  <span className={`badge badge-${c.segmento.toLowerCase()}`}>{c.segmento}</span>
                </div>
                <div className="cliente-acciones">
                  <button type="button" className="btn btn-secondary" onClick={() => iniciarEdicion(c)}>
                    Editar
                  </button>
                  {confirmarEliminarId === c.id ? (
                    <span className="confirmacion">
                      <span>¿Eliminar?</span>
                      <button
                        type="button"
                        className="btn btn-danger"
                        onClick={() => confirmarEliminar(c.id)}
                      >
                        Sí, eliminar
                      </button>
                      <button type="button" className="btn btn-secondary" onClick={cancelarEliminar}>
                        Cancelar
                      </button>
                    </span>
                  ) : (
                    <button
                      type="button"
                      className="btn btn-danger"
                      onClick={() => pedirConfirmacionEliminar(c.id)}
                    >
                      Eliminar
                    </button>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      <footer className="app-footer">
        <p>Datos ficticios en memoria; se reinician al recargar. Estado: candidate.</p>
      </footer>
    </main>
  );
}
