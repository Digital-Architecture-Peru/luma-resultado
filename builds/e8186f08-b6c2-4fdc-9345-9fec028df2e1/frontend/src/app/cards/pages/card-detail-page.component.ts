import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CardApiService } from '../data/card-api.service';
import { CardDetail } from '../data/card.model';
import { CardDetailPanelComponent } from '../organisms/card-detail-panel.component';
import { CardsLayoutComponent } from '../templates/cards-layout.component';

type ViewState = 'loading' | 'ready' | 'notFound' | 'error';

@Component({
  selector: 'app-card-detail-page',
  standalone: true,
  imports: [CardsLayoutComponent, CardDetailPanelComponent, RouterLink],
  template: `
    <app-cards-layout title="Detalle de tarjeta">
      <p><a routerLink="/tarjetas">← Volver a mis tarjetas</a></p>
      @switch (state()) {
        @case ('loading') { <p role="status">Cargando detalle…</p> }
        @case ('notFound') { <p role="alert">La tarjeta no existe.</p> }
        @case ('error') { <p role="alert">No fue posible consultar la tarjeta.</p> }
        @default { @if (card(); as c) { <app-card-detail-panel [card]="c" /> } }
      }
    </app-cards-layout>
  `,
})
export class CardDetailPageComponent implements OnInit {
  private readonly api = inject(CardApiService);
  private readonly route = inject(ActivatedRoute);

  readonly state = signal<ViewState>('loading');
  readonly card = signal<CardDetail | null>(null);

  ngOnInit(): void {
    const cardId = this.route.snapshot.paramMap.get('cardId') ?? '';
    this.api.get(cardId).subscribe({
      next: (card) => {
        this.card.set(card);
        this.state.set('ready');
      },
      error: (err: { status?: number }) => this.state.set(err.status === 404 ? 'notFound' : 'error'),
    });
  }
}
