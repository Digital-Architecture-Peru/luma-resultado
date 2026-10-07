import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { MaskPanPipe } from '../../pipes/mask-pan.pipe';

@Component({
  selector: 'app-card-number',
  imports: [MaskPanPipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<span class="pan" [attr.aria-label]="'Tarjeta terminada en ' + (value() | maskPan).slice(-4)">{{ value() | maskPan }}</span>`,
  styles: `.pan { font-variant-numeric: tabular-nums; letter-spacing: 0.05em; }`,
})
export class CardNumber {
  readonly value = input.required<string>();
}
