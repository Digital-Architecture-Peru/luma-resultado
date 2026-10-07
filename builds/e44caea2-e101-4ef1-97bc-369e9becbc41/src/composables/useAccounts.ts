import { ref } from 'vue';
import type { Account, AccountTypeOption } from '../domain/account';
import type { AccountRepository } from '../ports/AccountRepository';

export type ViewStatus = 'idle' | 'loading' | 'success' | 'empty' | 'error';

export const LIST_ERROR_MESSAGE = 'No fue posible consultar las cuentas. Intente nuevamente.';
export const DETAIL_ERROR_MESSAGE = 'No fue posible cargar el detalle de la cuenta.';
export const DETAIL_NOT_FOUND_MESSAGE = 'La cuenta solicitada no existe o no está disponible.';

/**
 * Estado de la consulta de cuentas (solo lectura).
 * Ignora respuestas obsoletas cuando hay solicitudes concurrentes.
 * No registra ni expone detalles del error original (pueden contener datos sensibles).
 */
export function useAccounts(repository: AccountRepository) {
  const accounts = ref<Account[]>([]);
  const status = ref<ViewStatus>('idle');
  const errorMessage = ref<string | null>(null);
  const filter = ref<AccountTypeOption>('ALL');

  const selectedId = ref<string | null>(null);
  const detail = ref<Account | null>(null);
  const detailLoading = ref(false);
  const detailError = ref<string | null>(null);

  let listSeq = 0;
  let detailSeq = 0;

  function clearSelection(): void {
    detailSeq += 1;
    selectedId.value = null;
    detail.value = null;
    detailError.value = null;
    detailLoading.value = false;
  }

  async function load(): Promise<void> {
    const seq = ++listSeq;
    status.value = 'loading';
    errorMessage.value = null;
    try {
      const result = await repository.list({ type: filter.value });
      if (seq !== listSeq) return;
      accounts.value = result;
      if (selectedId.value !== null && !result.some((a) => a.id === selectedId.value)) {
        clearSelection();
      }
      status.value = result.length === 0 ? 'empty' : 'success';
    } catch {
      if (seq !== listSeq) return;
      accounts.value = [];
      clearSelection();
      status.value = 'error';
      errorMessage.value = LIST_ERROR_MESSAGE;
    }
  }

  function setFilter(value: AccountTypeOption): Promise<void> {
    filter.value = value;
    return load();
  }

  async function select(id: string): Promise<void> {
    const seq = ++detailSeq;
    selectedId.value = id;
    detail.value = null;
    detailError.value = null;
    detailLoading.value = true;
    try {
      const found = await repository.getById(id);
      if (seq !== detailSeq) return;
      if (found === null) {
        detailError.value = DETAIL_NOT_FOUND_MESSAGE;
      } else {
        detail.value = found;
      }
    } catch {
      if (seq !== detailSeq) return;
      detailError.value = DETAIL_ERROR_MESSAGE;
    } finally {
      if (seq === detailSeq) {
        detailLoading.value = false;
      }
    }
  }

  return {
    accounts,
    status,
    errorMessage,
    filter,
    selectedId,
    detail,
    detailLoading,
    detailError,
    load,
    setFilter,
    select,
    clearSelection,
  };
}
