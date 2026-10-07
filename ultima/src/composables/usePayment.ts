import { ref } from 'vue';
import {
  toPaymentRequest,
  validatePayment,
  type Account,
  type Beneficiary,
  type PaymentErrors,
  type PaymentFormValues,
  type PaymentReceipt
} from '../domain/payment';
import type { PaymentGateway } from '../services/paymentGateway';

export type PaymentStatus = 'idle' | 'loading' | 'success' | 'error';

export function usePayment(gateway: PaymentGateway) {
  const accounts = ref<Account[]>([]);
  const beneficiaries = ref<Beneficiary[]>([]);
  const status = ref<PaymentStatus>('idle');
  const errors = ref<PaymentErrors>({});
  const errorMessage = ref('');
  const receipt = ref<PaymentReceipt | null>(null);
  const history = ref<PaymentReceipt[]>([]);

  async function load(): Promise<void> {
    accounts.value = await gateway.listAccounts();
    beneficiaries.value = await gateway.listBeneficiaries();
  }

  async function submit(values: PaymentFormValues): Promise<boolean> {
    if (status.value === 'loading') return false;
    errorMessage.value = '';
    receipt.value = null;

    const validation = validatePayment(values, accounts.value);
    errors.value = validation;
    if (Object.keys(validation).length > 0) {
      status.value = 'error';
      return false;
    }

    status.value = 'loading';
    try {
      const result = await gateway.submit(toPaymentRequest(values));
      receipt.value = result;
      history.value = [result, ...history.value];
      accounts.value = await gateway.listAccounts();
      status.value = 'success';
      return true;
    } catch (error) {
      errorMessage.value = error instanceof Error ? error.message : 'No se pudo procesar el pago.';
      status.value = 'error';
      return false;
    }
  }

  return { accounts, beneficiaries, status, errors, errorMessage, receipt, history, load, submit };
}
