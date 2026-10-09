import { filtrarPagos } from './filtrar-pagos';
import { Pago } from './pago.model';

const base: Pago = {
  id: 'x', fecha: '2026-01-01', beneficiario: 'Alfa', concepto: 'Servicio', monto: 10,
  moneda: 'PEN', estado: 'COMPLETADO', referencia: 'REF-1',
};

const pagos: Pago[] = [
  { ...base, id: '1', fecha: '2026-01-01', beneficiario: 'Alfa', estado: 'COMPLETADO' },
  { ...base, id: '2', fecha: '2026-03-01', beneficiario: 'Pensión Beta', estado: 'PENDIENTE', referencia: 'REF-2' },
  { ...base, id: '3', fecha: '2026-02-01', beneficiario: 'Gamma', estado: 'RECHAZADO', referencia: 'REF-3' },
];

describe('filtrarPagos', () => {
  it('given sin filtros when filtra then devuelve todos ordenados por fecha descendente', () => {
    const r = filtrarPagos(pagos, { texto: '', estado: 'TODOS' });
    expect(r.map((p) => p.id)).toEqual(['2', '3', '1']);
  });

  it('given un estado when filtra then solo devuelve ese estado', () => {
    const r = filtrarPagos(pagos, { texto: '', estado: 'RECHAZADO' });
    expect(r.map((p) => p.id)).toEqual(['3']);
  });

  it('given texto sin tildes when filtra then ignora mayúsculas y acentos', () => {
    const r = filtrarPagos(pagos, { texto: 'PENSION', estado: 'TODOS' });
    expect(r.map((p) => p.id)).toEqual(['2']);
  });

  it('given texto de referencia when filtra then busca por referencia', () => {
    const r = filtrarPagos(pagos, { texto: 'ref-3', estado: 'TODOS' });
    expect(r.map((p) => p.id)).toEqual(['3']);
  });

  it('given texto y estado incompatibles when filtra then devuelve vacío', () => {
    expect(filtrarPagos(pagos, { texto: 'alfa', estado: 'PENDIENTE' })).toEqual([]);
  });

  it('given la lista original when filtra then no la muta', () => {
    const copia = pagos.map((p) => p.id);
    filtrarPagos(pagos, { texto: '', estado: 'TODOS' });
    expect(pagos.map((p) => p.id)).toEqual(copia);
  });
});
