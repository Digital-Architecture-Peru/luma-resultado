import { Component, OnInit, inject, input, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CustomersStore } from '../state/customers.store';

@Component({
  selector: 'app-customer-form',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  template: `
    <h1>{{ id() ? 'Editar cliente' : 'Nuevo cliente' }}</h1>

    @if (notFound()) {
      <p class="error" role="alert">El cliente solicitado no existe.</p>
      <a class="btn secondary" routerLink="/clientes">Volver al listado</a>
    } @else {
      <form class="card" [formGroup]="form" (ngSubmit)="submit()" novalidate>
        <div class="field">
          <label for="name">Nombre</label>
          <input id="name" type="text" formControlName="name" autocomplete="off"
                 [attr.aria-invalid]="invalid('name')" aria-describedby="name-err" />
          <div id="name-err" class="error">
            @if (invalid('name')) { El nombre es obligatorio (máx. 100 caracteres). }
          </div>
        </div>

        <div class="field">
          <label for="email">Correo electrónico</label>
          <input id="email" type="email" formControlName="email" autocomplete="off"
                 [attr.aria-invalid]="invalid('email')" aria-describedby="email-err" />
          <div id="email-err" class="error">
            @if (invalid('email')) { Introduce un correo válido. }
          </div>
        </div>

        <div class="field">
          <label for="phone">Teléfono</label>
          <input id="phone" type="tel" formControlName="phone" autocomplete="off"
                 [attr.aria-invalid]="invalid('phone')" aria-describedby="phone-err" />
          <div id="phone-err" class="error">
            @if (invalid('phone')) { Teléfono no válido (7–20 caracteres: dígitos, espacios, +, -, paréntesis). }
          </div>
        </div>

        <div class="field">
          <label for="city">Ciudad</label>
          <input id="city" type="text" formControlName="city" autocomplete="off"
                 [attr.aria-invalid]="invalid('city')" aria-describedby="city-err" />
          <div id="city-err" class="error">
            @if (invalid('city')) { La ciudad es obligatoria. }
          </div>
        </div>

        @if (submitError(); as err) {
          <p class="error" role="alert">{{ err }}</p>
        }

        <div class="actions">
          <button type="submit" [disabled]="saving()">{{ id() ? 'Guardar cambios' : 'Crear cliente' }}</button>
          <a class="btn secondary" routerLink="/clientes">Cancelar</a>
        </div>
      </form>
    }
  `,
})
export class CustomerFormPage implements OnInit {
  /** Parámetro de ruta :id (withComponentInputBinding). Ausente en alta. */
  readonly id = input<string | undefined>(undefined);

  private readonly fb = inject(FormBuilder).nonNullable;
  private readonly store = inject(CustomersStore);
  private readonly router = inject(Router);

  protected readonly saving = signal(false);
  protected readonly notFound = signal(false);
  protected readonly submitError = signal<string | null>(null);

  readonly form = this.fb.group({
    name: ['', [Validators.required, Validators.maxLength(100), Validators.pattern(/\S/)]],
    email: ['', [Validators.required, Validators.email, Validators.maxLength(150)]],
    phone: ['', [Validators.required, Validators.pattern(/^[0-9 +()-]{7,20}$/)]],
    city: ['', [Validators.required, Validators.maxLength(80), Validators.pattern(/\S/)]],
  });

  async ngOnInit(): Promise<void> {
    const id = this.id();
    if (!id) return;
    const customer = await this.store.getById(id);
    if (!customer) {
      this.notFound.set(true);
      return;
    }
    this.form.patchValue({
      name: customer.name,
      email: customer.email,
      phone: customer.phone,
      city: customer.city,
    });
  }

  protected invalid(name: 'name' | 'email' | 'phone' | 'city'): boolean {
    const c = this.form.controls[name];
    return c.invalid && (c.touched || c.dirty);
  }

  async submit(): Promise<void> {
    this.submitError.set(null);
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.saving.set(true);
    try {
      const draft = this.form.getRawValue();
      const id = this.id();
      if (id) await this.store.update(id, draft);
      else await this.store.create(draft);
      await this.router.navigate(['/clientes']);
    } catch (e) {
      this.submitError.set(e instanceof Error ? e.message : 'No se pudo guardar el cliente.');
    } finally {
      this.saving.set(false);
    }
  }
}
