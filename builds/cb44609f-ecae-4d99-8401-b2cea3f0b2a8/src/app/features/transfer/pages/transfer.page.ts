import { ChangeDetectionStrategy, Component, OnInit, computed, inject } from '@angular/core';
import { ConfirmationPanelComponent } from '../../../shared/ui/organisms/confirmation-panel.component';
import { ReceiptCardComponent } from '../../../shared/ui/organisms/receipt-card.component';
import { TransferFormComponent } from '../../../shared/ui/organisms/transfer-form.component';
import { StepperLayoutComponent } from '../../../shared/ui/templates/stepper-layout.component';
import { TransferStore } from '../state/transfer.store';

/** Única pieza que conoce el store; el resto de la UI es presentacional. */
@Component({
  selector: 'app-transfer-page',
  standalone: true,
  imports: [StepperLayoutComponent, TransferFormComponent, ConfirmationPanelComponent, ReceiptCardComponent],
  providers: [TransferStore],
  changeDetection: ChangeDetectionStrategy.Default,
  template: `
    <ui-stepper-layout title="Transferencia entre mis cuentas" [step]="stepNumber()">
      @if (store.loading()) {
        <p role="status">Cargando cuentas…</p>
      } @else {
        @switch (store.step()) {
          @case ('capture') {
            @if (store.error()) {
              <div class="alert" role="alert">{{ store.error() }}</div>
            }
            @if (store.accounts().length === 0 && !store.error()) {
              <p>No tienes cuentas disponibles para transferir.</p>
            } @else if (store.accounts().length > 0) {
              <ui-transfer-form [accounts]="store.accounts()" [draft]="store.draft()" (submitted)="store.review($event)" />
            }
          }
          @case ('confirm') {
            @if (store.draft(); as draft) {
              <ui-confirmation-panel
                [from]="store.fromAccount()"
                [to]="store.toAccount()"
                [amountCents]="draft.amountCents"
                [concept]="draft.concept"
                [submitting]="store.submitting()"
                [error]="store.error()"
                (confirmed)="store.confirm()"
                (back)="store.back()"
              />
            }
          }
          @case ('receipt') {
            @if (store.receipt(); as receipt) {
              <ui-receipt-card [receipt]="receipt" (newTransfer)="store.reset()" />
            }
          }
        }
      }
    </ui-stepper-layout>
  `,
})
export class TransferPage implements OnInit {
  protected readonly store = inject(TransferStore);

  protected readonly stepNumber = computed(() => {
    switch (this.store.step()) {
      case 'capture':
        return 1;
      case 'confirm':
        return 2;
      default:
        return 3;
    }
  });

  ngOnInit(): void {
    this.store.load();
  }
}
