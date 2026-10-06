import { TestBed } from '@angular/core/testing';
import { ACCOUNTS_GATEWAY } from '../../../core/accounts/accounts.gateway';
import { GATEWAY_LATENCY_MS, InMemoryAccountsGateway } from '../../../core/accounts/in-memory.gateway';
import { TransferPage } from './transfer.page';

describe('TransferPage (integración)', () => {
  let el: HTMLElement;
  let fixture: ReturnType<typeof TestBed.createComponent<TransferPage>>;

  const choose = (id: string, value: string) => {
    const select = el.querySelector(`#${id}`) as HTMLSelectElement;
    select.value = value;
    select.dispatchEvent(new Event('change'));
  };

  const type = (id: string, value: string) => {
    const input = el.querySelector(`#${id}`) as HTMLInputElement;
    input.value = value;
    input.dispatchEvent(new Event('input'));
  };

  const click = (label: string) => {
    const button = Array.from(el.querySelectorAll('button')).find((b) => b.textContent?.includes(label));
    expect(button).withContext(`botón "${label}"`).toBeDefined();
    button?.click();
    fixture.detectChanges();
  };

  beforeEach(async () => {
    TestBed.configureTestingModule({
      providers: [
        InMemoryAccountsGateway,
        { provide: ACCOUNTS_GATEWAY, useExisting: InMemoryAccountsGateway },
        { provide: GATEWAY_LATENCY_MS, useValue: 0 },
      ],
    });
    fixture = TestBed.createComponent(TransferPage);
    el = fixture.nativeElement;
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();
  });

  const fillValid = () => {
    choose('fromId', 'acc-001');
    choose('toId', 'acc-002');
    type('amount', '100');
    type('concept', 'Ahorro mensual');
    fixture.detectChanges();
  };

  it('given loaded accounts then renders the capture form', () => {
    expect(el.querySelector('form')).not.toBeNull();
    expect(el.querySelectorAll('#fromId option').length).toBe(4);
  });

  it('given a valid form when going through the 3 steps then shows the receipt', () => {
    fillValid();
    click('Continuar');
    expect(el.textContent).toContain('Revisa los datos antes de confirmar');
    click('Confirmar transferencia');
    const status = el.querySelector('[role="status"]') as HTMLElement;
    expect(status.textContent).toContain('Transferencia exitosa');
    expect(status.textContent).toContain('TRX-000001');
  });

  it('given an invalid form when continuing then stays in step 1 with errors', () => {
    click('Continuar');
    expect(el.querySelector('form')).not.toBeNull();
    expect(el.textContent).toContain('Ingresa un monto.');
  });

  it('given the confirm step when going back then keeps the entered data', () => {
    fillValid();
    click('Continuar');
    click('Volver');
    expect((el.querySelector('#amount') as HTMLInputElement).value).toBe('100');
  });

  it('given a service failure then shows an alert and allows retry', () => {
    choose('fromId', 'acc-001');
    choose('toId', 'acc-002');
    type('amount', '10');
    type('concept', 'simular-error');
    fixture.detectChanges();
    click('Continuar');
    click('Confirmar transferencia');
    expect(el.querySelector('[role="alert"]')?.textContent).toContain('no está disponible');
    expect(el.textContent).toContain('Reintentar');
  });
});
