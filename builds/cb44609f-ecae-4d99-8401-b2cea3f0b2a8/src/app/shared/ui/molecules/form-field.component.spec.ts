import { TestBed } from '@angular/core/testing';
import { UiFormFieldComponent } from './form-field.component';

describe('UiFormFieldComponent', () => {
  const create = (inputs: Record<string, unknown>) => {
    const fixture = TestBed.createComponent(UiFormFieldComponent);
    fixture.componentRef.setInput('label', 'Monto');
    fixture.componentRef.setInput('forId', 'amount');
    for (const [key, value] of Object.entries(inputs)) {
      fixture.componentRef.setInput(key, value);
    }
    fixture.detectChanges();
    return fixture.nativeElement as HTMLElement;
  };

  it('given label and id then label is associated to the control id', () => {
    const el = create({});
    const label = el.querySelector('label') as HTMLLabelElement;
    expect(label.htmlFor).toBe('amount');
    expect(label.textContent).toContain('Monto');
  });

  it('given an error then it is shown in an aria-live region', () => {
    const el = create({ error: 'Monto inválido' });
    const region = el.querySelector('#amount-error') as HTMLElement;
    expect(region.getAttribute('aria-live')).toBe('polite');
    expect(region.textContent).toContain('Monto inválido');
  });

  it('given a hint then renders it', () => {
    const el = create({ hint: 'Máximo 2 decimales' });
    expect(el.querySelector('#amount-hint')?.textContent).toContain('Máximo 2 decimales');
  });
});
