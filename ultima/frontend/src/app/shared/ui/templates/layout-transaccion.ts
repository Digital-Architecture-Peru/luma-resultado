import { ChangeDetectionStrategy, Component } from '@angular/core';

/** Template: estructura de página (título, contenido principal, zona de resultado). */
@Component({
  selector: 'app-layout-transaccion',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <main>
      <h1>Transacción con tarjeta</h1>
      <div class="tarjeta"><ng-content select="[formulario]" /></div>
      <div class="tarjeta"><ng-content select="[resultado]" /></div>
    </main>
  `,
  styles: `
    main { max-width: 36rem; margin: 0 auto; padding: var(--space-6) var(--space-4); display: grid; gap: var(--space-4); }
    .tarjeta { background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius-md);
      padding: var(--space-4); box-shadow: var(--shadow-sm); }
    .tarjeta:empty { display: none; }
  `,
})
export class LayoutTransaccion {}
