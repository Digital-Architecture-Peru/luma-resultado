import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: 'app-usage-bar',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div
      class="usage"
      role="progressbar"
      aria-label="Línea de crédito utilizada"
      aria-valuemin="0"
      aria-valuemax="100"
      [attr.aria-valuenow]="percent"
    >
      <div class="usage__fill" [style.inline-size.%]="percent"></div>
    </div>
    <span class="usage__text">{{ percent }}% utilizado</span>
  `,
})
export class UsageBarComponent {
  @Input({ required: true }) percent = 0;
}
