import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';

/** Molecule: etiqueta + campo de texto + mensaje de error asociado. */
@Component({
  selector: 'app-campo-con-error',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <label [for]="idCampo()">{{ etiqueta() }}</label>
    <input
      [id]="idCampo()"
      type="text"
      inputmode="decimal"
      autocomplete="off"
      [value]="valor()"
      [attr.aria-invalid]="error() ? 'true' : null"
      [attr.aria-describedby]="error() ? idCampo() + '-error' : null"
      (input)="alEscribir($event)"
    />
    @if (error()) {
      <p class="error" [id]="idCampo() + '-error'" role="alert">{{ error() }}</p>
    }
  `,
  styles: `
    :host { display: grid; gap: var(--space-1); }
    label { font-weight: 600; }
    input { min-height: 44px; padding: 0 var(--space-3); border: 1px solid var(--border);
      border-radius: var(--radius-md); background: var(--surface); color: var(--text); font: inherit; }
    .error { margin: 0; color: var(--danger); font-size: 0.875rem; }
  `,
})
export class CampoConError {
  readonly idCampo = input.required<string>();
  readonly etiqueta = input.required<string>();
  readonly valor = input('');
  readonly error = input<string | null>(null);
  readonly valorCambio = output<string>();

  protected alEscribir(evento: Event): void {
    this.valorCambio.emit((evento.target as HTMLInputElement).value);
  }
}
