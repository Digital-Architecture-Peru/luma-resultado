import { Component, Input } from '@angular/core';
import { TipoNotificacion } from '../data/models';

const SIMBOLOS: Record<TipoNotificacion, string> = {
  COMPRA: '🛒',
  LIMITE: '📈',
  VENCIMIENTO: '📅',
  PAGO: '💳'
};

@Component({
  selector: 'app-icono-tipo',
  standalone: true,
  template: `<span aria-hidden="true">{{ simbolo }}</span>`
})
export class IconoTipoComponent {
  @Input({ required: true }) tipo!: TipoNotificacion;

  get simbolo(): string {
    return SIMBOLOS[this.tipo];
  }
}
