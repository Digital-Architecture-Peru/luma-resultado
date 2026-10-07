import { useMemo, useState } from 'react';

type Estado = 'Pendiente' | 'Procesada' | 'Rechazada';

interface Transaccion {
  id: string;
  beneficiario: string;
  cuenta: string;
  monto: number;
  concepto: string;
  estado: Estado;
  fecha: string;
}

const ESTADOS: Estado[] = ['Pendiente', 'Procesada', 'Rechazada'];

let secuencia = 3;

const datosIniciales: Transaccion[] = [
  { id: 'TRX-0001', beneficiario: 'Ana Rojas', cuenta: '1234567890', monto: 150000, concepto: 'Pago de arriendo', estado: 'Procesada', fecha: '2026-10-01' },
  { id: 'TRX-0002', beneficiario: 'Comercial Andina SAS', cuenta: '9988776655', monto: 420000, concepto: 'Pago proveedor', estado: 'Pendiente', fecha: '2026-10-03' },
  { id: 'TRX-0003', beneficiario: 'Carlos Pérez', cuenta: '5566778899', monto: 75000, concepto: 'Transferencia personal', estado: 'Rechazada', fecha: '2026-10-05' },
];

const moneda = new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 });

function validarCuenta(cuenta: string): string | null {
  if (!/^\d{8,12}$/.test(cuenta)) return 'La cuenta debe tener entre 8 y 12 dígitos.';
  return null;
}

function validarMonto(monto: number): string | null {
  if (!Number.isFinite(monto) || monto <= 0) return 'El monto debe ser mayor a cero.';
  if (monto > 50000000) return 'El monto supera el límite permitido (50.000.000).';
  return null;
}

export default function App() {
  const [transacciones, setTransacciones] = useState<Transaccion[]>(datosIniciales);
  const [beneficiario, setBeneficiario] = useState('');
  const [cuenta, setCuenta] = useState('');
  const [monto, setMonto] = useState('');
  const [concepto, setConcepto] = useState('');
  const [errores, setErrores] = useState<Record<string, string>>({});
  const [busqueda, setBusqueda] = useState('');
  const [filtroEstado, setFiltroEstado] = useState<'Todos' | Estado>('Todos');
  const [idAConfirmar, setIdAConfirmar] = useState<string | null>(null);
  const [mensaje, setMensaje] = useState('');
  const [capacidadMensaje, setCapacidadMensaje] = useState('');

  const listaFiltrada = useMemo(() => {
    const texto = busqueda.trim().toLowerCase();
    return transacciones.filter((t) => {
      const coincideTexto =
        texto === '' ||
        t.beneficiario.toLowerCase().includes(texto) ||
        t.cuenta.includes(texto) ||
        t.id.toLowerCase().includes(texto);
      const coincideEstado = filtroEstado === 'Todos' || t.estado === filtroEstado;
      return coincideTexto && coincideEstado;
    });
  }, [transacciones, busqueda, filtroEstado]);

  function crearTransaccion(e: React.FormEvent) {
    e.preventDefault();
    const nuevosErrores: Record<string, string> = {};
    if (beneficiario.trim().length < 3) nuevosErrores.beneficiario = 'Ingresa el nombre completo del beneficiario.';
    const errorCuenta = validarCuenta(cuenta.trim());
    if (errorCuenta) nuevosErrores.cuenta = errorCuenta;
    const montoNumerico = Number(monto);
    const errorMonto = validarMonto(montoNumerico);
    if (errorMonto) nuevosErrores.monto = errorMonto;
    if (concepto.trim().length < 3) nuevosErrores.concepto = 'Describe el concepto del pago.';

    setErrores(nuevosErrores);
    if (Object.keys(nuevosErrores).length > 0) {
      setMensaje('No se pudo registrar: revisa los campos marcados.');
      return;
    }

    secuencia += 1;
    const nueva: Transaccion = {
      id: `TRX-${String(secuencia).padStart(4, '0')}`,
      beneficiario: beneficiario.trim(),
      cuenta: cuenta.trim(),
      monto: montoNumerico,
      concepto: concepto.trim(),
      estado: 'Pendiente',
      fecha: new Date().toISOString().slice(0, 10),
    };
    setTransacciones((prev) => [nueva, ...prev]);
    setBeneficiario('');
    setCuenta('');
    setMonto('');
    setConcepto('');
    setMensaje(`Transacción ${nueva.id} registrada como Pendiente.`);
  }

  function pedirConfirmacionEliminar(id: string) {
    setIdAConfirmar(id);
  }

  function cancelarEliminar() {
    setIdAConfirmar(null);
  }

  function confirmarEliminar(id: string) {
    setTransacciones((prev) => prev.filter((t) => t.id !== id));
    setIdAConfirmar(null);
    setMensaje(`Transacción ${id} eliminada.`);
  }

  function cambiarEstado(id: string, estado: Estado) {
    setTransacciones((prev) => prev.map((t) => (t.id === id ? { ...t, estado } : t)));
    setMensaje(`Transacción ${id} marcada como ${estado}.`);
  }

  function probarCapacidad() {
    setCapacidadMensaje('Transacción de Pagos');
  }

  return (
    <main className="app-shell">
      <header className="app-header">
        <div>
          <p className="app-eyebrow">Banca por Internet · Pagos</p>
          <h1>Transacción de Pagos</h1>
          <p className="app-subtitle">Registra, busca y gestiona transacciones de pago en memoria (datos ficticios).</p>
        </div>
        <div className="capacidad-demo">
          <button type="button" className="btn btn-ghost" onClick={probarCapacidad}>
            Probar capacidad
          </button>
          <p role="status" aria-live="polite" className="capacidad-status">
            {capacidadMensaje}
          </p>
        </div>
      </header>

      <section className="card" aria-labelledby="form-titulo">
        <h2 id="form-titulo">Nueva transacción</h2>
        <form onSubmit={crearTransaccion} noValidate>
          <div className="form-grid">
            <div className="field">
              <label htmlFor="beneficiario">Beneficiario</label>
              <input
                id="beneficiario"
                type="text"
                value={beneficiario}
                onChange={(e) => setBeneficiario(e.target.value)}
                aria-invalid={Boolean(errores.beneficiario)}
                aria-describedby={errores.beneficiario ? 'error-beneficiario' : undefined}
              />
              {errores.beneficiario && (
                <span id="error-beneficiario" className="error-texto" role="alert">
                  {errores.beneficiario}
                </span>
              )}
            </div>

            <div className="field">
              <label htmlFor="cuenta">Cuenta destino</label>
              <input
                id="cuenta"
                type="text"
                inputMode="numeric"
                value={cuenta}
                onChange={(e) => setCuenta(e.target.value)}
                aria-invalid={Boolean(errores.cuenta)}
                aria-describedby={errores.cuenta ? 'error-cuenta' : undefined}
              />
              {errores.cuenta && (
                <span id="error-cuenta" className="error-texto" role="alert">
                  {errores.cuenta}
                </span>
              )}
            </div>

            <div className="field">
              <label htmlFor="monto">Monto (COP)</label>
              <input
                id="monto"
                type="number"
                min="1"
                value={monto}
                onChange={(e) => setMonto(e.target.value)}
                aria-invalid={Boolean(errores.monto)}
                aria-describedby={errores.monto ? 'error-monto' : undefined}
              />
              {errores.monto && (
                <span id="error-monto" className="error-texto" role="alert">
                  {errores.monto}
                </span>
              )}
            </div>

            <div className="field">
              <label htmlFor="concepto">Concepto</label>
              <input
                id="concepto"
                type="text"
                value={concepto}
                onChange={(e) => setConcepto(e.target.value)}
                aria-invalid={Boolean(errores.concepto)}
                aria-describedby={errores.concepto ? 'error-concepto' : undefined}
              />
              {errores.concepto && (
                <span id="error-concepto" className="error-texto" role="alert">
                  {errores.concepto}
                </span>
              )}
            </div>
          </div>

          <div className="form-actions">
            <button type="submit" className="btn btn-primary">
              Registrar transacción
            </button>
          </div>
        </form>
        <p role="status" aria-live="polite" className="form-status">
          {mensaje}
        </p>
      </section>

      <section className="card" aria-labelledby="lista-titulo">
        <div className="lista-header">
          <h2 id="lista-titulo">Transacciones registradas</h2>
          <div className="filtros">
            <div className="field field-inline">
              <label htmlFor="busqueda">Buscar</label>
              <input
                id="busqueda"
                type="search"
                placeholder="Beneficiario, cuenta o ID"
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
              />
            </div>
            <div className="field field-inline">
              <label htmlFor="filtro-estado">Estado</label>
              <select
                id="filtro-estado"
                value={filtroEstado}
                onChange={(e) => setFiltroEstado(e.target.value as 'Todos' | Estado)}
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
        </div>

        {listaFiltrada.length === 0 ? (
          <p className="empty-state">No hay transacciones que coincidan con la búsqueda.</p>
        ) : (
          <div className="tabla-wrapper">
            <table>
              <caption className="sr-only">Listado de transacciones de pago</caption>
              <thead>
                <tr>
                  <th scope="col">ID</th>
                  <th scope="col">Beneficiario</th>
                  <th scope="col">Cuenta</th>
                  <th scope="col">Monto</th>
                  <th scope="col">Concepto</th>
                  <th scope="col">Fecha</th>
                  <th scope="col">Estado</th>
                  <th scope="col">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {listaFiltrada.map((t) => (
                  <tr key={t.id}>
                    <td>{t.id}</td>
                    <td>{t.beneficiario}</td>
                    <td>{t.cuenta}</td>
                    <td className="num">{moneda.format(t.monto)}</td>
                    <td>{t.concepto}</td>
                    <td>{t.fecha}</td>
                    <td>
                      <label className="sr-only" htmlFor={`estado-${t.id}`}>
                        Cambiar estado de {t.id}
                      </label>
                      <select
                        id={`estado-${t.id}`}
                        value={t.estado}
                        onChange={(e) => cambiarEstado(t.id, e.target.value as Estado)}
                        className={`badge badge-${t.estado.toLowerCase()}`}
                      >
                        {ESTADOS.map((estado) => (
                          <option key={estado} value={estado}>
                            {estado}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td>
                      {idAConfirmar === t.id ? (
                        <div className="confirma-grupo">
                          <span>¿Eliminar {t.id}?</span>
                          <button type="button" className="btn btn-danger btn-sm" onClick={() => confirmarEliminar(t.id)}>
                            Confirmar
                          </button>
                          <button type="button" className="btn btn-ghost btn-sm" onClick={cancelarEliminar}>
                            Cancelar
                          </button>
                        </div>
                      ) : (
                        <button
                          type="button"
                          className="btn btn-danger btn-sm"
                          onClick={() => pedirConfirmacionEliminar(t.id)}
                          aria-label={`Eliminar transacción ${t.id}`}
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

      <footer className="app-footer">
        <p>Datos ficticios en memoria; se reinician al recargar. Sin red ni persistencia.</p>
      </footer>
    </main>
  );
}
