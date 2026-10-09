import { TestBed } from '@angular/core/testing';
import { describe, expect, it } from 'vitest';
import { EtiquetaTarjeta } from './etiqueta-tarjeta';

describe('EtiquetaTarjeta', () => {
  it('given ultimos4 y tipo when render then muestra tarjeta enmascarada', async () => {
    const fixture = TestBed.createComponent(EtiquetaTarjeta);
    fixture.componentRef.setInput('ultimos4', '1111');
    fixture.componentRef.setInput('tipo', 'DEBITO');
    await fixture.whenStable();

    const texto = (fixture.nativeElement as HTMLElement).textContent ?? '';
    expect(texto).toContain('DEBITO •••• 1111');
  });

  it('given sin tipo when render then solo máscara', async () => {
    const fixture = TestBed.createComponent(EtiquetaTarjeta);
    fixture.componentRef.setInput('ultimos4', '2222');
    await fixture.whenStable();

    expect((fixture.nativeElement as HTMLElement).textContent).toContain('•••• 2222');
  });
});
