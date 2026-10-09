import { TestBed } from '@angular/core/testing';
import { describe, expect, it } from 'vitest';
import { EstadoPago } from '../pago.model';
import { EtiquetaEstadoComponent } from './etiqueta-estado.component';

describe('EtiquetaEstadoComponent', () => {
  const casos: [EstadoPago, string][] = [
    ['PENDIENTE', 'Pendiente'],
    ['CONFIRMADO', 'Confirmado'],
    ['RECHAZADO', 'Rechazado'],
  ];

  it.each(casos)('given estado %s, when se renderiza, then muestra el texto %s', (estado, texto) => {
    const fixture = TestBed.createComponent(EtiquetaEstadoComponent);
    fixture.componentRef.setInput('estado', estado);
    fixture.detectChanges();

    expect((fixture.nativeElement as HTMLElement).textContent?.trim()).toBe(texto);
  });
});
