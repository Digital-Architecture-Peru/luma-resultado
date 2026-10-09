import { Component } from '@angular/core';

@Component({
  selector: 'app-cuentas-layout',
  standalone: true,
  template: `
    <main class="layout">
      <header>
        <h1>Mis cuentas</h1>
        <p>Banca por Internet</p>
      </header>
      <section class="filtro" aria-label="Filtro de consulta"><ng-content select="[filtro]" /></section>
      <section aria-live="polite"><ng-content /></section>
    </main>
  `,
  styles: [
    `.layout { max-width: 48rem; margin-inline: auto; padding: var(--space-6) var(--space-4); }
     h1 { margin: 0; }
     header p { margin: 0 0 var(--space-4); color: var(--muted); }
     .filtro { margin-block: var(--space-4); }`,
  ],
})
export class CuentasLayoutComponent {}
