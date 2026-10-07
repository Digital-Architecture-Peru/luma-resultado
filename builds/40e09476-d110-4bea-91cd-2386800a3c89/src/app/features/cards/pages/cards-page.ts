import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CardsFacade } from '../../../core/cards/cards.facade';
import { CardList } from '../../../shared/ui/organisms/card-list';
import { ConsultationLayout } from '../../../shared/ui/templates/consultation-layout';

@Component({
  selector: 'app-cards-page',
  imports: [CardList, ConsultationLayout],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <app-consultation-layout heading="Mis tarjetas">
      @switch (facade.listStatus()) {
        @case ('loading') { <p role="status">Cargando tarjetas…</p> }
        @case ('error') {
          <p role="alert">No pudimos cargar tus tarjetas.</p>
          <button type="button" class="btn" (click)="facade.loadCards()">Reintentar</button>
        }
        @case ('empty') { <p role="status">No tienes tarjetas registradas.</p> }
        @default { <app-card-list [cards]="facade.cards()" (selected)="openDetail($event)" /> }
      }
    </app-consultation-layout>
  `,
})
export class CardsPage implements OnInit {
  protected readonly facade = inject(CardsFacade);
  private readonly router = inject(Router);

  ngOnInit(): void {
    this.facade.loadCards();
  }

  protected openDetail(id: string): void {
    void this.router.navigate(['/tarjetas', id]);
  }
}
