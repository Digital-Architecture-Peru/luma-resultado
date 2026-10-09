import { Component } from '@angular/core';

/** Template: layout de la pagina con ranuras para resumen, formulario, mensajes e historial. */
@Component({
  selector: 'app-transaction-template',
  standalone: true,
  template: `
    <main class="layout">
      <h1>Transacciones de tarjeta</h1>
      <section class="panel"><ng-content select="[slot=summary]" /></section>
      <section class="panel"><h2>Nueva transaccion</h2><ng-content select="[slot=form]" /><ng-content select="[slot=messages]" /></section>
      <section class="panel"><ng-content select="[slot=history]" /></section>
    </main>
  `,
  styles: [`
    .layout { display: grid; gap: var(--space-4); max-inline-size: 72rem; margin-inline: auto; padding: var(--space-6) clamp(1rem, 4vw, 2rem); }
    .panel { background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius-md); box-shadow: var(--shadow-sm); padding: var(--space-4); }
  `],
})
export class TransactionTemplateComponent {}
