import { act, renderHook } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { usePayment } from '../hooks/usePayment';
import type { PaymentsApi } from '../services/paymentsApi';
import type { PaymentRequest, PaymentResult } from '../types';

const request: PaymentRequest = {
  sourceAccountId: 'a1',
  beneficiaryAccount: '12345678',
  amount: '10.50',
  currency: 'USD',
  reference: '',
};

const result: PaymentResult = {
  id: 'p1',
  status: 'COMPLETED',
  amount: 10.5,
  currency: 'USD',
  beneficiaryAccount: '12345678',
  reference: '',
  createdAt: '2026-01-01T00:00:00Z',
};

function buildApi() {
  const createPayment = vi.fn<PaymentsApi['createPayment']>();
  const api: PaymentsApi = { listAccounts: vi.fn().mockResolvedValue([]), createPayment };
  return { api, createPayment };
}

describe('usePayment', () => {
  it('given a successful call when submitting then state is success with the result', async () => {
    const { api, createPayment } = buildApi();
    createPayment.mockResolvedValueOnce(result);
    const keyFactory = () => 'key-1';
    const { result: hook } = renderHook(() => usePayment(api, keyFactory));

    await act(async () => {
      await hook.current.submit(request);
    });

    expect(hook.current.state).toEqual({ phase: 'success', result });
    expect(createPayment).toHaveBeenCalledWith(request, 'key-1');
  });

  it('given a failure when retrying the same payment then reuses the idempotency key', async () => {
    const { api, createPayment } = buildApi();
    createPayment.mockRejectedValueOnce(new Error('boom')).mockResolvedValueOnce(result);
    const keyFactory = vi.fn().mockReturnValueOnce('key-1').mockReturnValueOnce('key-2');
    const { result: hook } = renderHook(() => usePayment(api, keyFactory));

    await act(async () => {
      await hook.current.submit(request);
    });
    expect(hook.current.state).toEqual({ phase: 'error', error: 'boom' });

    await act(async () => {
      await hook.current.submit(request);
    });

    expect(keyFactory).toHaveBeenCalledTimes(1);
    expect(createPayment.mock.calls.map((c) => c[1])).toEqual(['key-1', 'key-1']);
    expect(hook.current.state.phase).toBe('success');
  });

  it('given a changed payload when retrying then uses a new idempotency key', async () => {
    const { api, createPayment } = buildApi();
    createPayment.mockRejectedValueOnce(new Error('boom')).mockResolvedValueOnce(result);
    const keyFactory = vi.fn().mockReturnValueOnce('key-1').mockReturnValueOnce('key-2');
    const { result: hook } = renderHook(() => usePayment(api, keyFactory));

    await act(async () => {
      await hook.current.submit(request);
    });
    await act(async () => {
      await hook.current.submit({ ...request, amount: '20.00' });
    });

    expect(createPayment.mock.calls.map((c) => c[1])).toEqual(['key-1', 'key-2']);
  });
});
