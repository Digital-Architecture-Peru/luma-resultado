import { InjectionToken } from '@angular/core';
import { Observable } from 'rxjs';
import { Tarjeta } from '../domain/tarjeta.model';

/** Puerto de acceso a datos de tarjetas (solo lectura). */
export abstract class TarjetasRepository {
  abstract listar(): Observable<Tarjeta[]>;
}

export const TARJETAS_REPOSITORY = new InjectionToken<TarjetasRepository>('TarjetasRepository');
