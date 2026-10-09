import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Pago } from '../domain/pago.model';
import { PagosRepository } from '../domain/pagos.repository';

export const PAGOS_FICTICIOS: readonly Pago[] = [
  { id: 'p-001', fecha: '2026-10-08', beneficiario: 'Empresa Eléctrica Demo', concepto: 'Servicio de luz septiembre', monto: 182.5, moneda: 'PEN', estado: 'COMPLETADO', referencia: 'REF-100001' },
  { id: 'p-002', fecha: '2026-10-07', beneficiario: 'Agua Demo S.A.', concepto: 'Servicio de agua', monto: 64.9, moneda: 'PEN', estado: 'COMPLETADO', referencia: 'REF-100002' },
  { id: 'p-003', fecha: '2026-10-05', beneficiario: 'Universidad Ejemplo', concepto: 'Pensión octubre', monto: 450, moneda: 'USD', estado: 'PENDIENTE', referencia: 'REF-100003' },
  { id: 'p-004', fecha: '2026-10-02', beneficiario: 'Telecom Ficticia', concepto: 'Plan móvil', monto: 99, moneda: 'PEN', estado: 'RECHAZADO', referencia: 'REF-100004' },
  { id: 'p-005', fecha: '2026-09-28', beneficiario: 'Seguros Modelo', concepto: 'Prima seguro vehicular', monto: 120.75, moneda: 'USD', estado: 'COMPLETADO', referencia: 'REF-100005' },
  { id: 'p-006', fecha: '2026-09-25', beneficiario: 'Inmobiliaria Muestra', concepto: 'Alquiler departamento', monto: 1500, moneda: 'PEN', estado: 'PENDIENTE', referencia: 'REF-100006' },
];

@Injectable()
export class PagosMockRepository extends PagosRepository {
  override consultar(): Observable<readonly Pago[]> {
    return of(PAGOS_FICTICIOS);
  }
}
