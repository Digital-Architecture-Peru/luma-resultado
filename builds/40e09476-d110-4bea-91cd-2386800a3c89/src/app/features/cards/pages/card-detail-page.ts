import { ChangeDetectionStrategy, Component, effect, inject, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CardsFacade } from '../../../core/cards/cards.facade';
import { CardDetail } from '../../../shared/ui/organisms/card-detail';
import { MovementsTable } from '../../../shared/ui/organisms/movements-table';
import { ConsultationLayout } from '../../../shared/ui/templates/consultation-layout';

@Component({
  selector: 'app-card-detail-page',
  imports: [CardDetail, MovementsTable, ConsultationLayout, RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <app-consultation-layout heading="Detalle de tarjeta">
      <a routerLink="/tarjetas">← Volver a mis tarjetas</a>
      @switch (facade.detailStatus()) {
        @case ('loading') { <p role="status">Cargando detalle…</p> }
        @case ('error') { <p role="alert">No pudimos cargar el detalle.</p> }
        @case ('empty') { <p role="status">La tarjeta solicitada no existe.</p> }
        @default {
          @if (facade.selectedCard(); as card) {
            <app-card-detail [card]="card" />
            <app-movements-table [movements]="facade.movements()" />
          }
        }
      }
    </app-consultation-layout>
  `,
})
export class CardDetailPage {
  /** Enlazado desde la ruta :id (withComponentInputBinding). */
  readonly id = input.required<string>();
  protected readonly facade = inject(CardsFacade);

  constructor() {
    effect(() => this.facade.loadDetail(this.id()));
  }
}
