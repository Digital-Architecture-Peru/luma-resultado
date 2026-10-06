import { Component, OnInit, inject, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { CustomersStore } from '../state/customers.store';

@Component({
  selector: 'app-customers-list',
  standalone: true,
  imports: [RouterLink, DatePipe],
  template: `
    <h1>Clientes</h1>

    <div class="toolbar">
      <div class="grow">
        <label for="search">Buscar</label>
        <input
          id="search"
          type="search"
          placeholder="Nombre, correo, teléfono o ciudad"
          [value]="store.query()"
          (input)="onSearch($event)"
        />
      </div>
      <a class="btn" routerLink="/clientes/nuevo">Nuevo cliente</a>
    </div>

    @if (store.error(); as err) {
      <p class="error" role="alert">{{ err }}</p>
    }

    <p role="status" class="muted">
      @if (store.loading()) { Cargando… } @else { {{ store.filtered().length }} de {{ store.customers().length }} clientes }
    </p>

    @if (!store.loading()) {
      @if (store.filtered().length === 0) {
        <div class="card" data-testid="empty">
          @if (store.query()) { No hay clientes que coincidan con la búsqueda. }
          @else { Aún no hay clientes. Crea el primero con «Nuevo cliente». }
        </div>
      } @else {
        <div class="card table-wrap">
          <table>
            <caption class="muted">Listado de clientes</caption>
            <thead>
              <tr>
                <th scope="col">Nombre</th>
                <th scope="col">Correo</th>
                <th scope="col">Teléfono</th>
                <th scope="col">Ciudad</th>
                <th scope="col">Alta</th>
                <th scope="col">Acciones</th>
              </tr>
            </thead>
            <tbody>
              @for (c of store.filtered(); track c.id) {
                <tr data-testid="row">
                  <td>{{ c.name }}</td>
                  <td>{{ c.email }}</td>
                  <td>{{ c.phone }}</td>
                  <td>{{ c.city }}</td>
                  <td>{{ c.createdAt | date: 'shortDate' }}</td>
                  <td>
                    <div class="actions">
                      @if (pendingDelete() === c.id) {
                        <span>¿Eliminar a {{ c.name }}?</span>
                        <button type="button" class="danger" (click)="confirmDelete(c.id)">Confirmar</button>
                        <button type="button" class="secondary" (click)="pendingDelete.set(null)">Cancelar</button>
                      } @else {
                        <a class="btn secondary" [routerLink]="['/clientes', c.id, 'editar']"
                           [attr.aria-label]="'Editar ' + c.name">Editar</a>
                        <button type="button" class="secondary" (click)="pendingDelete.set(c.id)"
                           [attr.aria-label]="'Eliminar ' + c.name">Eliminar</button>
                      }
                    </div>
                  </td>
                </tr>
              }
            </tbody>
          </table>
        </div>
      }
    }
  `,
})
export class CustomersListPage implements OnInit {
  protected readonly store = inject(CustomersStore);
  protected readonly pendingDelete = signal<string | null>(null);

  ngOnInit(): void {
    void this.store.load();
  }

  protected onSearch(event: Event): void {
    this.store.setQuery((event.target as HTMLInputElement).value);
  }

  protected async confirmDelete(id: string): Promise<void> {
    await this.store.remove(id);
    this.pendingDelete.set(null);
  }
}
