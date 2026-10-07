import { CurrencyPipe, DatePipe } from '@angular/common';
import { Component, OnInit, inject, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CardsStore } from '../../state/cards.store';
import { maskPan } from '../../domain/mask-pan';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'mfe-card-detail',
  standalone: true,
  imports: [RouterLink, CurrencyPipe, DatePipe],
  providers: [CardsStore],
  templateUrl: './card-detail.component.html',
  styleUrl: './card-detail.component.scss',
})
export class CardDetailComponent implements OnInit {
  /** Enlazado desde el parámetro de ruta :id (withComponentInputBinding). */
  readonly id = input.required<string>();

  protected readonly store = inject(CardsStore);
  protected readonly mask = maskPan;
  protected readonly currency = environment.currency;

  ngOnInit(): void {
    this.store.loadCard(this.id());
  }
}
