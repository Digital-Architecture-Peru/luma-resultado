import { Injectable } from '@angular/core';
import { Observable, delay, of } from 'rxjs';
import { Tarjeta } from '../domain/tarjeta.model';
import { TarjetasRepository } from './tarjetas.repository';

export const MOCK_DELAY_MS = 150;

const TARJETAS_FICTICIAS: readonly Tarjeta[] = [
  {
    id: 't-001',
    alias: 'Visa Signature',
    numero: '4000 0000 0000 1234',
    tipo: 'CREDITO',
    estado: 'ACTIVA',
    saldo: 1250.75,
    limite: 8000,
    moneda: 'PEN',
  },
  {
    id: 't-002',
    alias: 'Débito Sueldo',
    numero: '5100 0000 0000 5678',
    tipo: 'DEBITO',
    estado: 'ACTIVA',
    saldo: 3420.1,
    limite: 0,
    moneda: 'PEN',
  },
  {
    id: 't-003',
    alias: 'Mastercard Viajes',
    numero: '5200 0000 0000 9012',
    tipo: 'CREDITO',
    estado: 'BLOQUEADA',
    saldo: 0,
    limite: 5000,
    moneda: 'PEN',
  },
];

@Injectable()
export class TarjetasMockRepository extends TarjetasRepository {
  listar(): Observable<Tarjeta[]> {
    return of(TARJETAS_FICTICIAS.map((t) => ({ ...t }))).pipe(delay(MOCK_DELAY_MS));
  }
}
