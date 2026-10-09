import { TestBed } from '@angular/core/testing';
import { Observable, of, throwError } from 'rxjs';
import { PagosRepository } from '../domain/pagos.repository';
import { Pago } from '../domain/pago.model';
import { PAGOS_FICTICIOS } from '../adapters/pagos-mock.repository';
import { PagosConsultaPageComponent } from './pagos-consulta-page.component';

class RepoOk extends PagosRepository {
  override consultar(): Observable<readonly Pago[]> {
    return of(PAGOS_FICTICIOS);
  }
}

class RepoError extends PagosRepository {
  override consultar(): Observable<readonly Pago[]> {
    return throwError(() => new Error('fallo simulado'));
  }
}

function crear(repo: new () => PagosRepository) {
  TestBed.configureTestingModule({
    imports: [PagosConsultaPageComponent],
    providers: [{ provide: PagosRepository, useClass: repo }],
  });
  const fixture = TestBed.createComponent(PagosConsultaPageComponent);
  fixture.detectChanges();
  return fixture;
}

describe('PagosConsultaPageComponent', () => {
  it('given repositorio ok when carga then muestra todas las filas y el resumen', () => {
    const fixture = crear(RepoOk);
    const el = fixture.nativeElement as HTMLElement;
    expect(el.querySelectorAll('tbody tr').length).toBe(PAGOS_FICTICIOS.length);
    expect(el.querySelector('[role="status"]')?.textContent).toContain(`${PAGOS_FICTICIOS.length} pagos encontrados`);
  });

  it('given texto de búsqueda when escribe then filtra las filas', () => {
    const fixture = crear(RepoOk);
    const el = fixture.nativeElement as HTMLElement;
    const input = el.querySelector('#filtro-texto') as HTMLInputElement;
    input.value = 'agua';
    input.dispatchEvent(new Event('input'));
    fixture.detectChanges();
    expect(el.querySelectorAll('tbody tr').length).toBe(1);
    expect(el.querySelector('[role="status"]')?.textContent).toContain('1 pago encontrado');
  });

  it('given filtro sin resultados when filtra then muestra estado vacío y limpiar restaura', () => {
    const fixture = crear(RepoOk);
    const el = fixture.nativeElement as HTMLElement;
    const input = el.querySelector('#filtro-texto') as HTMLInputElement;
    input.value = 'zzzz-no-existe';
    input.dispatchEvent(new Event('input'));
    fixture.detectChanges();
    expect(el.querySelector('.empty')?.textContent).toContain('No se encontraron pagos');

    const limpiar = Array.from(el.querySelectorAll('button')).find((b) => b.textContent?.includes('Limpiar')) as HTMLButtonElement;
    limpiar.click();
    fixture.detectChanges();
    expect(el.querySelectorAll('tbody tr').length).toBe(PAGOS_FICTICIOS.length);
  });

  it('given estado seleccionado when cambia then solo muestra pagos de ese estado', () => {
    const fixture = crear(RepoOk);
    const el = fixture.nativeElement as HTMLElement;
    const select = el.querySelector('#filtro-estado') as HTMLSelectElement;
    select.value = 'PENDIENTE';
    select.dispatchEvent(new Event('change'));
    fixture.detectChanges();
    const esperados = PAGOS_FICTICIOS.filter((p) => p.estado === 'PENDIENTE').length;
    expect(el.querySelectorAll('tbody tr').length).toBe(esperados);
  });

  it('given repositorio con fallo when carga then muestra alerta de error', () => {
    const fixture = crear(RepoError);
    const el = fixture.nativeElement as HTMLElement;
    expect(el.querySelector('[role="alert"]')?.textContent).toContain('No se pudo consultar');
    expect(el.querySelectorAll('tbody tr').length).toBe(0);
  });
});
