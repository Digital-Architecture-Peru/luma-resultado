import { TestBed } from '@angular/core/testing';
import { UiButtonComponent } from './button.component';

describe('UiButtonComponent', () => {
  const create = (inputs: Record<string, unknown>) => {
    const fixture = TestBed.createComponent(UiButtonComponent);
    for (const [key, value] of Object.entries(inputs)) {
      fixture.componentRef.setInput(key, value);
    }
    fixture.detectChanges();
    return fixture.nativeElement.querySelector('button') as HTMLButtonElement;
  };

  it('given defaults then renders an enabled button of type button', () => {
    const button = create({});
    expect(button.disabled).toBeFalse();
    expect(button.type).toBe('button');
  });

  it('given loading then disables the button and sets aria-busy', () => {
    const button = create({ loading: true });
    expect(button.disabled).toBeTrue();
    expect(button.getAttribute('aria-busy')).toBe('true');
  });

  it('given secondary variant then applies the secondary class', () => {
    const button = create({ variant: 'secondary' });
    expect(button.classList).toContain('btn--secondary');
  });
});
