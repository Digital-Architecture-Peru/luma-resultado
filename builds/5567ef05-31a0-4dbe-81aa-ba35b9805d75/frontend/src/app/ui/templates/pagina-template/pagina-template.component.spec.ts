import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { PaginaTemplateComponent } from './pagina-template.component';

@Component({
  standalone: true,
  imports: [PaginaTemplateComponent],
  template: '<app-pagina-template titulo="Mis cuentas"><p id="contenido">Hola</p></app-pagina-template>',
})
class AnfitrionComponent {}

describe('PaginaTemplateComponent', () => {
  it('given un título y contenido, when renderiza, then muestra el h1 y proyecta el contenido', () => {
    const fixture = TestBed.createComponent(AnfitrionComponent);
    fixture.detectChanges();

    const raiz: HTMLElement = fixture.nativeElement;
    expect(raiz.querySelector('h1')?.textContent).toBe('Mis cuentas');
    expect(raiz.querySelector('#contenido')?.textContent).toBe('Hola');
  });
});
