import { act, renderHook } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import type { PaymentsClient } from '../api/paymentsClient';
import type { PaymentRequest, PaymentResponse } from '../types';
import { usePayment } from './usePayment';

const request: PaymentRequest = {
  originAccount: '00012345678901',
  beneficiary: 'Empresa Demo',
  amount: 10,
  currency: 'USD',
  concept: 'Recibo',
};

const response: PaymentResponse = {
  id: 'abc',
  status: 'CONFIRMADO',
  beneficiary: 'Empresa Demo',
  amount: 10,
  currency: 'USD',
  concept: 'Recibo',
  createdAt: '2026-01-01T00:00:00Z',
};

describe('usePayment', () => {
  it('given client succeeds when submitting then state is success', async () => {
    const create = vi.fn().mockResolvedValue(response);
    const client: PaymentsClient = { create };
    const { result } = renderHook(() => usePayment(client));

    await act(async () => {
      await result.current.submit(request);
    });

    expect(result.current.state).toEqual({ status: 'success', payment: response });
    expect(create).toHaveBeenCalledWith(request, expect.any(String));
  });

  it('given client fails when submitting then state is error with message', async () => {
    const client: PaymentsClient = { create: vi.fn().mockRejectedValue(new Error('Importe invalido')) };
    const { result } = renderHook(() => usePayment(client));

    await act(async () => {
      await result.current.submit(request);
    });

    expect(result.current.state).toEqual({ status: 'error', message: 'Importe invalido' });
  });
});
