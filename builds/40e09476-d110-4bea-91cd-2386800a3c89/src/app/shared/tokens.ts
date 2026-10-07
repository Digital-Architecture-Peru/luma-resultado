import { InjectionToken } from '@angular/core';

/** Moneda por defecto para mostrar importes (H3: país sin confirmar). */
export const CURRENCY_CODE = new InjectionToken<string>('CURRENCY_CODE', {
  providedIn: 'root',
  factory: () => 'USD',
});
