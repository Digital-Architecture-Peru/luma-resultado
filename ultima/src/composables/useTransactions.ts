import { ref } from 'vue';
import type { Card, TransactionRecord, TransactionRequest } from '../domain/types';
import { TransactionError, type TransactionGateway } from '../services/transactionGateway';

export type LoadState = 'idle' | 'loading' | 'ready' | 'error';

export function useTransactions(gateway: TransactionGateway) {
  const cards = ref<Card[]>([]);
  const history = ref<TransactionRecord[]>([]);
  const loadState = ref<LoadState>('idle');
  const submitting = ref(false);
  const confirmation = ref('');
  const errorMessage = ref('');

  async function load(): Promise<void> {
    loadState.value = 'loading';
    try {
      const [loadedCards, loadedHistory] = await Promise.all([
        gateway.listCards(),
        gateway.listTransactions(),
      ]);
      cards.value = loadedCards;
      history.value = loadedHistory;
      loadState.value = 'ready';
    } catch {
      errorMessage.value = 'No se pudo cargar la información de tarjetas.';
      loadState.value = 'error';
    }
  }

  async function submit(request: TransactionRequest): Promise<boolean> {
    submitting.value = true;
    confirmation.value = '';
    errorMessage.value = '';
    try {
      const record = await gateway.submit(request);
      confirmation.value = `Transacción ${record.id} aprobada.`;
      await load();
      return true;
    } catch (error) {
      errorMessage.value =
        error instanceof TransactionError ? error.message : 'No se pudo procesar la transacción.';
      return false;
    } finally {
      submitting.value = false;
    }
  }

  return { cards, history, loadState, submitting, confirmation, errorMessage, load, submit };
}
