import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';

@Component({
  selector: 'app-search-field',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <label class="field">
      <span class="sr-only">{{ label() }}</span>
      <input
        type="search"
        [value]="value()"
        [attr.placeholder]="placeholder()"
        maxlength="50"
        autocomplete="off"
        (input)="onInput($event)"
      />
    </label>
  `,
  styles: `
    .field { display: block; }
    input { width: 100%; min-height: var(--tap); padding: 0 var(--space-3); font-size: 1rem;
      border: 1px solid var(--color-border); border-radius: var(--radius); background: var(--color-surface); color: var(--color-text); }
  `,
})
export class SearchFieldComponent {
  readonly label = input.required<string>();
  readonly placeholder = input<string>('Buscar');
  readonly value = input<string>('');
  readonly valueChange = output<string>();

  onInput(event: Event): void {
    this.valueChange.emit((event.target as HTMLInputElement).value);
  }
}
