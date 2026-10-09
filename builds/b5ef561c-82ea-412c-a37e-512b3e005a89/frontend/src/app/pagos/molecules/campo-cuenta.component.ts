import { Component, input } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-campo-cuenta',
  imports: [ReactiveFormsModule],
  template: `
    <div class="field">
      <label [for]="inputId()">{{ etiqueta() }}</label>
      <input [id]="inputId()" type="text" autocomplete="off" [formControl]="control()"
        [attr.aria-invalid]="mostrarError()" [attr.aria-describedby]="inputId() + '-error'" />
      @if (mostrarError()) {
        <p class="error" [id]="inputId() + '-error'">Use de 8 a 34 caracteres: A-Z, 0-9 o guion.</p>
      }
    </div>
  `,
})
export class CampoCuentaComponent {
  readonly etiqueta = input.required<string>();
  readonly inputId = input.required<string>();
  readonly control = input.required<FormControl<string>>();

  mostrarError(): boolean {
    const c = this.control();
    return c.invalid && (c.touched || c.dirty);
  }
}
