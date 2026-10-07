import { Component, OnInit, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CardsStore } from '../../state/cards.store';
import { maskPan } from '../../domain/mask-pan';

@Component({
  selector: 'mfe-card-list',
  standalone: true,
  imports: [RouterLink],
  providers: [CardsStore],
  templateUrl: './card-list.component.html',
  styleUrl: './card-list.component.scss',
})
export class CardListComponent implements OnInit {
  protected readonly store = inject(CardsStore);
  protected readonly mask = maskPan;

  ngOnInit(): void {
    this.store.loadCards();
  }

  retry(): void {
    this.store.loadCards();
  }
}
