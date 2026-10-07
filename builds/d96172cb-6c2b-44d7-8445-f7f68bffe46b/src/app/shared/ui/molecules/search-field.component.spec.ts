import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SearchFieldComponent } from './search-field.component';

describe('SearchFieldComponent', () => {
  let fixture: ComponentFixture<SearchFieldComponent>;

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchFieldComponent);
    fixture.componentRef.setInput('label', 'Buscar cuenta');
    fixture.detectChanges();
  });

  it('given a label when rendered then the input is wrapped by a label', () => {
    const label: HTMLElement = fixture.nativeElement.querySelector('label');
    expect(label.textContent).toContain('Buscar cuenta');
    expect(label.querySelector('input')).not.toBeNull();
  });

  it('given user typing when input fires then emits the typed text', () => {
    const emitted: string[] = [];
    fixture.componentInstance.valueChange.subscribe((v) => emitted.push(v));
    const input: HTMLInputElement = fixture.nativeElement.querySelector('input');
    input.value = 'nómina';
    input.dispatchEvent(new Event('input'));
    expect(emitted).toEqual(['nómina']);
  });
});
