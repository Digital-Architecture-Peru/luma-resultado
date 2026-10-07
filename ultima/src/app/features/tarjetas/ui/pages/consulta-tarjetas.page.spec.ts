import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Observable, Subject, of, throwError } from 'rxjs';
import { TARJETAS_REPOSITORY, TarjetasRepository } from '../../data/tarjetas.repository';
import { Tarjeta } from '../../domain/tarjeta.model';
import { ConsultaTarjetasPage } from './consulta-tarjetas.page';

const TARJETA: Tarjeta = {
  id: 's-1',
  alias: 'Stub Card',
  numero: '4000 0000 0000 7777',
  tipo: 'DEBITO',
  estado: 'ACTIVA',
  saldo: 10,
  limite: 0,
  moneda: 'PEN',
};

function crearPagina(origen: Observable<Tarjeta[]>): ComponentFixture<ConsultaTarjetasPage> {
  const stub: TarjetasRepository = { listar: () => origen };
  TestBed.configureTestingModule({
    imports: [ConsultaTarjetasPage],
    providers: [{ provide: TARJETAS_REPOSITORY, useValue: stub }],
  });
  const fixture = TestBed.createComponent(ConsultaTarjetasPage);
  fixture.detectChanges();
  return fixture;
}

describe('ConsultaTarjetasPage', () => {
  it('given una respuesta pendiente when se carga then muestra el estado de carga', () => {
    const fixture = crearPagina(new Subject<Tarjeta[]>());

    expect((fixture.nativeElement as HTMLElement).textContent).toContain('Cargando tarjetas');
  });

  it('given tarjetas when se carga then las lista', () => {
    const fixture = crearPagina(of([TARJETA]));

    const texto = (fixture.nativeElement as HTMLElement).textContent ?? '';
    expect(texto).toContain('Stub Card');
    expect(texto).toContain('**** 7777');
  });

  it('given una lista vacía when se carga then muestra el estado vacío', () => {
    const fixture = crearPagina(of([]));

    expect((fixture.nativeElement as HTMLElement).textContent).toContain('No tienes tarjetas');
  });

  it('given un fallo when se carga then muestra alerta con reintento', () => {
    const fixture = crearPagina(throwError(() => new Error('fallo')));

    const el = fixture.nativeElement as HTMLElement;
    expect(el.querySelector('[role="alert"]')).not.toBeNull();
    expect(el.textContent).toContain('Reintentar');
  });

  it('given una tarjeta when se selecciona then se anuncia en role=status con PAN enmascarado', () => {
    const fixture = crearPagina(of([TARJETA]));
    const el = fixture.nativeElement as HTMLElement;

    el.querySelector<HTMLButtonElement>('app-tarjeta-resumen button')!.click();
    fixture.detectChanges();

    const estado = el.querySelector('.seleccion');
    expect(estado?.textContent).toContain('Stub Card');
    expect(estado?.textContent).toContain('**** 7777');
  });
});
