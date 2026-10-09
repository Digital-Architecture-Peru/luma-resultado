import { useCallback, useRef, useState } from 'react';
import type { PaymentsApi } from '../services/paymentsApi';
import type { PaymentRequest, PaymentResult } from '../types';

export interface PaymentState {
  phase: 'idle' | 'submitting' | 'success' | 'error';
  result?: PaymentResult;
  error?: string;
}

export function newIdempotencyKey(): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') return crypto.randomUUID();
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 12)}`;
}

interface PendingKey {
  key: string;
  fingerprint: string;
}

/**
 * Reutiliza la misma Idempotency-Key al reintentar el mismo pago tras un error,
 * y genera una nueva cuando el contenido cambia o el pago se completó.
 */
export function usePayment(api: PaymentsApi, keyFactory: () => string = newIdempotencyKey) {
  const [state, setState] = useState<PaymentState>({ phase: 'idle' });
  const pending = useRef<PendingKey | null>(null);

  const submit = useCallback(
    async (request: PaymentRequest) => {
      const fingerprint = JSON.stringify(request);
      if (pending.current === null || pending.current.fingerprint !== fingerprint) {
        pending.current = { key: keyFactory(), fingerprint };
      }
      setState({ phase: 'submitting' });
      try {
        const result = await api.createPayment(request, pending.current.key);
        pending.current = null;
        setState({ phase: 'success', result });
      } catch (e) {
        setState({ phase: 'error', error: e instanceof Error ? e.message : 'Error inesperado' });
      }
    },
    [api, keyFactory],
  );

  const reset = useCallback(() => setState({ phase: 'idle' }), []);

  return { state, submit, reset };
}
