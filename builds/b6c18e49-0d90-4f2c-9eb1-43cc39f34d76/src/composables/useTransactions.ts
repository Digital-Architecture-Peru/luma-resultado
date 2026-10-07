import { ref } from 'vue';
import type { Card, Transaction, TransactionInput } from '../domain/types';
import { TransactionError } from '../domain/types';
import type { TransactionGateway } from '../services/transactionGateway';

export type Feedback = { kind: 'success' | 'error'; text: string } | null;

export function useTransactions(gateway: TransactionGateway) {
  const cards = ref<Card[]>([]);
  const transactions = ref<Transaction[]>([]);
  const loading = ref(false);
  const submitting = ref(false);
  const feedback = ref<Feedback>(null);

  async function refresh(): Promise<void> {
    [cards.value, transactions.value] = await Promise.all([
      gateway.listCards(),
      gateway.listTransactions(),
    ]);
  }

  async function load(): Promise<void> {
    loading.value = true;
    try {
      await refresh();
    } catch {
      feedback.value = { kind: 'error', text: 'No se pudo cargar la información.' };
    } finally {
      loading.value = false;
    }
  }

  async function submit(input: TransactionInput): Promise<boolean> {
    submitting.value = true;
    feedback.value = null;
    try {
      const tx = await gateway.submit(input);
      await refresh();
      feedback.value = { kind: 'success', text: `Transacción ${tx.id} aprobada.` };
      return true;
    } catch (error) {
      const text = error instanceof TransactionError ? error.message : 'Error inesperado. Intenta de nuevo.';
      feedback.value = { kind: 'error', text };
      return false;
    } finally {
      submitting.value = false;
    }
  }

  return { cards, transactions, loading, submitting, feedback, load, submit };
}
