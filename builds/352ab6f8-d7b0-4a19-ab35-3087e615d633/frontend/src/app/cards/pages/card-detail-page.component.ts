import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CardDetail } from '../data/card.model';
import { CardsApiService } from '../data/cards-api.service';
import { CardDetailPanelComponent } from '../organisms/card-detail-panel.component';
import { CardsLayoutComponent } from '../templates/cards-layout.component';

type LoadState = 'loading' | 'ready' | 'notFound' | 'error';

@Component({
  selector: 'app-card-detail-page',
  standalone: true,
  imports: [RouterLink, CardsLayoutComponent, CardDetailPanelComponent],
  template: `
    <app-cards-layout title="Detalle de tarjeta">
      <p><a routerLink="/cards">← Volver a mis tarjetas</a></p>
      @switch (state()) {
        @case ('loading') { <p role="status">Cargando…</p> }
        @case ('notFound') { <p role="alert">La tarjeta no existe.</p> }
        @case ('error') { <p role="alert">No pudimos cargar la tarjeta.</p> }
        @default {
          @if (card(); as c) { <app-card-detail-panel [card]="c" /> }
        }
      }
    </app-cards-layout>
  `,
})
export class CardDetailPageComponent implements OnInit {
  private readonly api = inject(CardsApiService);
  private readonly route = inject(ActivatedRoute);

  readonly state = signal<LoadState>('loading');
  readonly card = signal<CardDetail | null>(null);

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id') ?? '';
    this.api.get(id).subscribe({
      next: (card) => {
        this.card.set(card);
        this.state.set('ready');
      },
      error: (err: { status?: number }) =>
        this.state.set(err.status === 404 || err.status === 400 ? 'notFound' : 'error'),
    });
  }
}
