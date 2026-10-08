import { Component, Input, OnInit, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CardsApiService } from '../core/cards-api.service';
import { Card, LoadState, Movement, Page } from '../core/models';
import { CardsLayoutComponent } from '../templates/cards-layout.component';
import { CardDetailPanelComponent } from '../organisms/card-detail-panel.component';
import { MovementTableComponent } from '../organisms/movement-table.component';

@Component({
  selector: 'app-card-detail-page',
  standalone: true,
  imports: [RouterLink, CardsLayoutComponent, CardDetailPanelComponent, MovementTableComponent],
  template: `
    <app-cards-layout title="Detalle de tarjeta">
      <p><a routerLink="/">← Volver a mis tarjetas</a></p>
      @switch (state()) {
        @case ('loading') { <p class="state" role="status">Cargando…</p> }
        @case ('error') { <p class="state state--error" role="alert">No se encontró la tarjeta o no se pudo cargar.</p> }
        @default {
          @if (card(); as c) { <app-card-detail-panel [card]="c" /> }
          @if (movements(); as m) { <app-movement-table [data]="m" (pageChange)="loadMovements($event)" /> }
        }
      }
    </app-cards-layout>
  `,
})
export class CardDetailPageComponent implements OnInit {
  private readonly api = inject(CardsApiService);

  @Input({ required: true }) id!: string;

  readonly state = signal<LoadState>('loading');
  readonly card = signal<Card | null>(null);
  readonly movements = signal<Page<Movement> | null>(null);

  ngOnInit(): void {
    this.api.get(this.id).subscribe({
      next: (card) => {
        this.card.set(card);
        this.state.set('ready');
        this.loadMovements(1);
      },
      error: () => this.state.set('error'),
    });
  }

  loadMovements(page: number): void {
    this.api.movements(this.id, page).subscribe({
      next: (result) => this.movements.set(result),
      error: () => this.state.set('error'),
    });
  }
}
