import { TestBed } from '@angular/core/testing';
import { EstadoBadgeComponent } from './estado-badge.component';
import { EstadoPago } from '../../core/pago.model';

describe('EstadoBadgeComponent', () => {
  const casos: Array<[EstadoPago, string]> = [
    ['PROCESADO', 'ok'],
    ['PENDIENTE', 'warn'],
    ['RECHAZADO', 'error'],
    ['ANULADO', 'neutral'],
  ];

  it.each(casos)('given estado %s when renderiza then muestra el texto y el tono %s', (estado, tono) => {
    const fixture = TestBed.createComponent(EstadoBadgeComponent);
    fixture.componentRef.setInput('estado', estado);
    fixture.detectChanges();

    const span = (fixture.nativeElement as HTMLElement).querySelector('span') as HTMLSpanElement;

    expect(span.textContent).toContain(estado);
    expect(span.classList.contains(tono)).toBe(true);
  });
});
