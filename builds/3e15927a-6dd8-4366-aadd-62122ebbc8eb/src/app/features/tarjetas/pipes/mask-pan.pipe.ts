import { Pipe, PipeTransform } from '@angular/core';

const DIGITOS_VISIBLES = 4;

@Pipe({ name: 'maskPan', standalone: true })
export class MaskPanPipe implements PipeTransform {
  transform(valor: string | null | undefined): string {
    const digitos = (valor ?? '').replace(/\D/g, '');
    if (digitos.length === 0) {
      return '';
    }
    return `**** ${digitos.slice(-DIGITOS_VISIBLES)}`;
  }
}
