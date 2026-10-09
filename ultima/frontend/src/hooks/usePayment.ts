import { useCallback, useState } from 'react';
import { createPaymentsClient, type PaymentsClient } from '../api/paymentsClient';
import type { PaymentRequest, PaymentResponse } from '../types';

export type PaymentState =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'success'; payment: PaymentResponse }
  | { status: 'error'; message: string };

const defaultClient = createPaymentsClient();

export function usePayment(client: PaymentsClient = defaultClient) {
  const [state, setState] = useState<PaymentState>({ status: 'idle' });

  const submit = useCallback(
    async (request: PaymentRequest) => {
      setState({ status: 'loading' });
      try {
        const payment = await client.create(request, crypto.randomUUID());
        setState({ status: 'success', payment });
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Error inesperado';
        setState({ status: 'error', message });
      }
    },
    [client],
  );

  const reset = useCallback(() => setState({ status: 'idle' }), []);

  return { state, submit, reset };
}
