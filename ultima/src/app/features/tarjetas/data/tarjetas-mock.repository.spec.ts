import { fakeAsync, tick } from '@angular/core/testing';
import { Tarjeta } from '../domain/tarjeta.model';
import { MOCK_DELAY_MS, TarjetasMockRepository } from './tarjetas-mock.repository';

describe('TarjetasMockRepository', () => {
  it('given el mock when se lista then devuelve tarjetas ficticias tras la latencia', fakeAsync(() => {
    let resultado: Tarjeta[] | undefined;
    new TarjetasMockRepository().listar().subscribe((t) => (resultado = t));

    expect(resultado).toBeUndefined();
    tick(MOCK_DELAY_MS);

    expect(resultado).toBeDefined();
    expect(resultado!.length).toBe(3);
    expect(resultado!.every((t) => t.id.length > 0 && t.alias.length > 0)).toBeTrue();
  }));

  it('given dos consultas when se modifica una then la otra no se altera', fakeAsync(() => {
    const repo = new TarjetasMockRepository();
    let primera: Tarjeta[] = [];
    let segunda: Tarjeta[] = [];
    repo.listar().subscribe((t) => (primera = t));
    tick(MOCK_DELAY_MS);
    primera.pop();
    repo.listar().subscribe((t) => (segunda = t));
    tick(MOCK_DELAY_MS);

    expect(segunda.length).toBe(3);
  }));
});
