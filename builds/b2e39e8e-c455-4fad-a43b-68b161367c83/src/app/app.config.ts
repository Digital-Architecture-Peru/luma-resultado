import { ApplicationConfig } from '@angular/core';
import { PagosRepository } from './domain/pagos.repository';
import { PagosMockRepository } from './adapters/pagos-mock.repository';

/**
 * Único punto de composición: la integración real aún no está definida,
 * por eso se enlaza el puerto PagosRepository con un adaptador de datos ficticios.
 * Para integrar un API real, sustituir useClass por un adaptador HTTP.
 */
export const appConfig: ApplicationConfig = {
  providers: [{ provide: PagosRepository, useClass: PagosMockRepository }],
};
