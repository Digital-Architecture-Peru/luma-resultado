import { Pipe, PipeTransform } from '@angular/core';

/** Defensa extra: muestra siempre "**** 1234", sin importar si llega un PAN completo. */
@Pipe({ name: 'maskPan' })
export class MaskPanPipe implements PipeTransform {
  transform(value: string | null | undefined): string {
    if (!value) {
      return '';
    }
    const last4 = /(\d{4})\D*$/.exec(value)?.[1];
    return last4 ? `**** ${last4}` : '****';
  }
}
