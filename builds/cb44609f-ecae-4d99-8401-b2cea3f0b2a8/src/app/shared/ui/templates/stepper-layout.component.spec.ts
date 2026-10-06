import { TestBed } from '@angular/core/testing';
import { StepperLayoutComponent } from './stepper-layout.component';

describe('StepperLayoutComponent', () => {
  it('given step 2 then marks only the second item as current', () => {
    const fixture = TestBed.createComponent(StepperLayoutComponent);
    fixture.componentRef.setInput('title', 'Transferencia');
    fixture.componentRef.setInput('step', 2);
    fixture.detectChanges();
    const items = Array.from((fixture.nativeElement as HTMLElement).querySelectorAll('li'));
    expect(items.length).toBe(3);
    expect(items.map((li) => li.getAttribute('aria-current'))).toEqual([null, 'step', null]);
  });

  it('given a title then renders it as heading', () => {
    const fixture = TestBed.createComponent(StepperLayoutComponent);
    fixture.componentRef.setInput('title', 'Transferencia');
    fixture.componentRef.setInput('step', 1);
    fixture.detectChanges();
    expect((fixture.nativeElement as HTMLElement).querySelector('h2')?.textContent).toContain('Transferencia');
  });
});
