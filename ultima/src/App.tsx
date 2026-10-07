import { useMemo, useState } from 'react';

/**
 * Transacción de Pagos · Portal empresas
 * Organización interna inspirada en Feature-Sliced Design (todo en un solo
 * archivo por restricción de la plataforma: entities -> features -> pages -> app).
 * Datos ficticios en memoria. Sin red, sin persistencia, sin dependencias nuevas.
 */

/* ---------------------------------- entities: cuenta / beneficiario ---------------------------------- */

interface Cuenta {
  id: string;
  etiqueta: string;
  saldoCentavos: number;
}

interface Beneficiario {
  id: string;
  nombre: string;
  banco: string;
}

const CUENTAS: Cuenta[] = [
  { id: 'cta-001', etiqueta: 'Cuenta corriente · 0012', saldoCentavos: 452_300_00 },
  { id: 'cta-002', etiqueta: 'Cuenta nómina · 0047', saldoCentavos: 98_750_00 },
];

const BENEFICIARIOS: Beneficiario[] = [
  { id: 'ben-001', nombre: 'Proveedor Andes S.A.', banco: 'Banco Austral' },
  { id: 'ben-002', nombre: 'Insumos del Valle Ltda.', banco: 'Banco Cumbre' },
];

const formateaMonto = (centavos: number): string =>
  new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP' }).format(
    Math.round(centavos / 100),
  );

/* ---------------------------------- entities: transacción ---------------------------------- */

interface TransaccionSimulada {
  referencia: string;
  cuenta: Cuenta;
  beneficiario: Beneficiario;
  montoCentavos: number;
  concepto: string;
  fecha: string;
}

let contadorReferencia = 0;
function crearReferenciaFicticia(): string {
  contadorReferencia += 1;
  return `SIM-${String(contadorReferencia).padStart(4, '0')}`;
}

/* ---------------------------------- features: formulario de transacción ---------------------------------- */

interface FormularioEstado {
  cuentaId: string;
  beneficiarioId: string;
  montoTexto: string;
  concepto: string;
}

interface Errores {
  cuentaId?: string;
  beneficiarioId?: string;
  montoTexto?: string;
  concepto?: string;
}

function validar(form: FormularioEstado, cuentas: Cuenta[]): Errores {
  const errores: Errores = {};
  if (!form.cuentaId) errores.cuentaId = 'Selecciona una cuenta de origen.';
  if (!form.beneficiarioId) errores.beneficiarioId = 'Selecciona un beneficiario.';

  const montoNumero = Number(form.montoTexto.replace(',', '.'));
  if (!form.montoTexto.trim()) {
    errores.montoTexto = 'Ingresa un monto.';
  } else if (Number.isNaN(montoNumero) || montoNumero <= 0) {
    errores.montoTexto = 'El monto debe ser un número mayor que cero.';
  } else {
    const cuenta = cuentas.find((c) => c.id === form.cuentaId);
    if (cuenta && montoNumero * 100 > cuenta.saldoCentavos) {
      errores.montoTexto = 'El monto supera el saldo disponible de la cuenta.';
    }
  }

  if (!form.concepto.trim()) {
    errores.concepto = 'Ingresa un concepto para la transacción.';
  } else if (form.concepto.trim().length > 80) {
    errores.concepto = 'El concepto no puede superar 80 caracteres.';
  }

  return errores;
}

/* ---------------------------------- pages: pago a proveedor (simulado) ---------------------------------- */

export default function App() {
  const [form, setForm] = useState<FormularioEstado>({
    cuentaId: CUENTAS[0].id,
    beneficiarioId: BENEFICIARIOS[0].id,
    montoTexto: '150000',
    concepto: 'Pago factura N° 4521',
  });
  const [errores, setErrores] = useState<Errores>({});
  const [ultima, setUltima] = useState<TransaccionSimulada | null>(null);
  const [mensajeEstado, setMensajeEstado] = useState<string>('');
  const [historial, setHistorial] = useState<TransaccionSimulada[]>([]);
  const [filtro, setFiltro] = useState('');

  const cuentaSeleccionada = useMemo(
    () => CUENTAS.find((c) => c.id === form.cuentaId) ?? CUENTAS[0],
    [form.cuentaId],
  );
  const beneficiarioSeleccionado = useMemo(
    () => BENEFICIARIOS.find((b) => b.id === form.beneficiarioId) ?? BENEFICIARIOS[0],
    [form.beneficiarioId],
  );

  const montoNumero = Number(form.montoTexto.replace(',', '.'));
  const montoValidoParaResumen = form.montoTexto.trim() !== '' && !Number.isNaN(montoNumero) && montoNumero > 0;

  function actualizarCampo<K extends keyof FormularioEstado>(campo: K, valor: FormularioEstado[K]) {
    setForm((prev) => ({ ...prev, [campo]: valor }));
  }

  function manejarProbarCapacidad() {
    const nuevosErrores = validar(form, CUENTAS);
    setErrores(nuevosErrores);

    if (Object.keys(nuevosErrores).length > 0) {
      setMensajeEstado('Hay errores en el formulario. Revisa los campos marcados.');
      setUltima(null);
      return;
    }

    const transaccion: TransaccionSimulada = {
      referencia: crearReferenciaFicticia(),
      cuenta: cuentaSeleccionada,
      beneficiario: beneficiarioSeleccionado,
      montoCentavos: Math.round(montoNumero * 100),
      concepto: form.concepto.trim(),
      fecha: new Date().toISOString(),
    };

    setUltima(transaccion);
    setHistorial((prev) => [transaccion, ...prev]);
    // Texto exacto esperado por el criterio de aceptación de la capacidad.
    setMensajeEstado('Transacción de Pagos');
  }

  const historialFiltrado = historial.filter((t) =>
    `${t.referencia} ${t.beneficiario.nombre} ${t.concepto}`
      .toLowerCase()
      .includes(filtro.toLowerCase()),
  );

  return (
    <main className="app-shell">
      <header className="app-header">
        <h1>Transacción de Pagos</h1>
        <p className="subtitulo">Portal empresas · Dominio Pagos</p>
        <p className="aviso" role="note">
          Simulación con datos ficticios. No se mueve dinero real.
        </p>
      </header>

      <section className="panel" aria-labelledby="form-titulo">
        <h2 id="form-titulo">Pago a proveedor (simulado)</h2>

        <form
          className="formulario"
          onSubmit={(e) => e.preventDefault()}
          noValidate
        >
          <div className="campo">
            <label htmlFor="cuenta">Cuenta origen</label>
            <select
              id="cuenta"
              value={form.cuentaId}
              onChange={(e) => actualizarCampo('cuentaId', e.target.value)}
              aria-invalid={Boolean(errores.cuentaId)}
              aria-describedby={errores.cuentaId ? 'cuenta-error' : undefined}
            >
              {CUENTAS.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.etiqueta} · saldo {formateaMonto(c.saldoCentavos)}
                </option>
              ))}
            </select>
            {errores.cuentaId && (
              <p id="cuenta-error" className="error-campo">
                {errores.cuentaId}
              </p>
            )}
          </div>

          <div className="campo">
            <label htmlFor="beneficiario">Beneficiario</label>
            <select
              id="beneficiario"
              value={form.beneficiarioId}
              onChange={(e) => actualizarCampo('beneficiarioId', e.target.value)}
              aria-invalid={Boolean(errores.beneficiarioId)}
              aria-describedby={errores.beneficiarioId ? 'beneficiario-error' : undefined}
            >
              {BENEFICIARIOS.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.nombre} · {b.banco}
                </option>
              ))}
            </select>
            {errores.beneficiarioId && (
              <p id="beneficiario-error" className="error-campo">
                {errores.beneficiarioId}
              </p>
            )}
          </div>

          <div className="campo">
            <label htmlFor="monto">Monto (CLP)</label>
            <input
              id="monto"
              type="text"
              inputMode="decimal"
              value={form.montoTexto}
              onChange={(e) => actualizarCampo('montoTexto', e.target.value)}
              aria-invalid={Boolean(errores.montoTexto)}
              aria-describedby={errores.montoTexto ? 'monto-error' : undefined}
            />
            {errores.montoTexto && (
              <p id="monto-error" className="error-campo">
                {errores.montoTexto}
              </p>
            )}
          </div>

          <div className="campo campo-ancho">
            <label htmlFor="concepto">Concepto</label>
            <input
              id="concepto"
              type="text"
              value={form.concepto}
              onChange={(e) => actualizarCampo('concepto', e.target.value)}
              aria-invalid={Boolean(errores.concepto)}
              aria-describedby={errores.concepto ? 'concepto-error' : undefined}
              maxLength={80}
            />
            {errores.concepto && (
              <p id="concepto-error" className="error-campo">
                {errores.concepto}
              </p>
            )}
          </div>
        </form>

        <div className="resumen" aria-labelledby="resumen-titulo">
          <h3 id="resumen-titulo">Resumen antes de confirmar</h3>
          <dl>
            <div className="resumen-fila">
              <dt>Cuenta origen</dt>
              <dd>{cuentaSeleccionada.etiqueta}</dd>
            </div>
            <div className="resumen-fila">
              <dt>Beneficiario</dt>
              <dd>
                {beneficiarioSeleccionado.nombre} ({beneficiarioSeleccionado.banco})
              </dd>
            </div>
            <div className="resumen-fila">
              <dt>Monto</dt>
              <dd>{montoValidoParaResumen ? formateaMonto(Math.round(montoNumero * 100)) : '—'}</dd>
            </div>
            <div className="resumen-fila">
              <dt>Concepto</dt>
              <dd>{form.concepto.trim() || '—'}</dd>
            </div>
          </dl>
        </div>

        <button type="button" className="boton-primario" onClick={manejarProbarCapacidad}>
          Probar capacidad
        </button>

        <p role="status" className="estado-mensaje">
          {mensajeEstado}
        </p>

        {ultima && (
          <p className="detalle-transaccion">
            Referencia ficticia <strong>{ultima.referencia}</strong> · {formateaMonto(ultima.montoCentavos)} a{' '}
            {ultima.beneficiario.nombre} desde {ultima.cuenta.etiqueta}.
          </p>
        )}
      </section>

      <section className="panel" aria-labelledby="historial-titulo">
        <h2 id="historial-titulo">Historial de transacciones simuladas</h2>

        <div className="campo campo-ancho">
          <label htmlFor="buscar-historial">Buscar por referencia, beneficiario o concepto</label>
          <input
            id="buscar-historial"
            type="search"
            value={filtro}
            onChange={(e) => setFiltro(e.target.value)}
            placeholder="Ej: SIM-0001, Andes, factura"
          />
        </div>

        {historial.length === 0 ? (
          <p className="estado-vacio">Aún no se ha probado ninguna transacción en esta sesión.</p>
        ) : historialFiltrado.length === 0 ? (
          <p className="estado-vacio">Sin coincidencias para «{filtro}».</p>
        ) : (
          <ul className="lista-historial">
            {historialFiltrado.map((t) => (
              <li key={t.referencia} className="item-historial">
                <span className="item-referencia">{t.referencia}</span>
                <span>{t.beneficiario.nombre}</span>
                <span>{formateaMonto(t.montoCentavos)}</span>
                <span className="item-concepto">{t.concepto}</span>
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  );
}
