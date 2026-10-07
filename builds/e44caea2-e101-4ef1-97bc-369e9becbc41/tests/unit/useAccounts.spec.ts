import { describe, expect, it } from 'vitest';
import {
  DETAIL_ERROR_MESSAGE,
  DETAIL_NOT_FOUND_MESSAGE,
  LIST_ERROR_MESSAGE,
  useAccounts,
} from '../../src/composables/useAccounts';
import type { Account } from '../../src/domain/account';
import { fixtureAccounts } from '../../src/fixtures/accounts';
import { deferred, makeRepository } from '../helpers/fakeRepository';

describe('useAccounts', () => {
  it('given accounts available, when loaded, then status is success', async () => {
    const state = useAccounts(makeRepository());
    expect(state.status.value).toBe('idle');
    await state.load();
    expect(state.status.value).toBe('success');
    expect(state.accounts.value).toHaveLength(fixtureAccounts.length);
  });

  it('given no accounts, when loaded, then status is empty', async () => {
    const state = useAccounts(makeRepository({ list: async () => [] }));
    await state.load();
    expect(state.status.value).toBe('empty');
  });

  it('given the repository fails, when loaded, then status is error with a generic message', async () => {
    const state = useAccounts(
      makeRepository({ list: async () => Promise.reject(new Error('detalle interno sensible')) }),
    );
    await state.load();
    expect(state.status.value).toBe('error');
    expect(state.errorMessage.value).toBe(LIST_ERROR_MESSAGE);
    expect(state.errorMessage.value).not.toContain('sensible');
  });

  it('given a filter change, when setFilter, then the list is reloaded with that type', async () => {
    const state = useAccounts(makeRepository());
    await state.load();
    await state.setFilter('CHECKING');
    expect(state.filter.value).toBe('CHECKING');
    expect(state.accounts.value.every((a) => a.type === 'CHECKING')).toBe(true);
    expect(state.accounts.value.length).toBeGreaterThan(0);
  });

  it('given an id, when select, then the detail is loaded', async () => {
    const state = useAccounts(makeRepository());
    await state.load();
    await state.select('acc-002');
    expect(state.selectedId.value).toBe('acc-002');
    expect(state.detail.value?.id).toBe('acc-002');
    expect(state.detailLoading.value).toBe(false);
    expect(state.detailError.value).toBeNull();
  });

  it('given an unknown id, when select, then a not-found error is exposed', async () => {
    const state = useAccounts(makeRepository());
    await state.select('zzz');
    expect(state.detail.value).toBeNull();
    expect(state.detailError.value).toBe(DETAIL_NOT_FOUND_MESSAGE);
  });

  it('given getById fails, when select, then a generic detail error is exposed', async () => {
    const state = useAccounts(makeRepository({ getById: async () => Promise.reject(new Error('x')) }));
    await state.select('acc-001');
    expect(state.detailError.value).toBe(DETAIL_ERROR_MESSAGE);
    expect(state.detailLoading.value).toBe(false);
  });

  it('given a selection, when clearSelection, then detail state is reset', async () => {
    const state = useAccounts(makeRepository());
    await state.select('acc-001');
    state.clearSelection();
    expect(state.selectedId.value).toBeNull();
    expect(state.detail.value).toBeNull();
  });

  it('given a selected account filtered out, when reloading, then the selection is cleared', async () => {
    const state = useAccounts(makeRepository());
    await state.load();
    await state.select('acc-001'); // SAVINGS
    await state.setFilter('CHECKING');
    expect(state.selectedId.value).toBeNull();
    expect(state.detail.value).toBeNull();
  });

  it('given two overlapping loads, when the older resolves last, then its result is ignored', async () => {
    const first = deferred<Account[]>();
    const second = deferred<Account[]>();
    const queue = [first, second];
    const state = useAccounts(makeRepository({ list: () => queue.shift()!.promise }));

    const p1 = state.load();
    const p2 = state.load();
    second.resolve([fixtureAccounts[0]]);
    await p2;
    first.resolve([...fixtureAccounts]);
    await p1;

    expect(state.accounts.value).toHaveLength(1);
    expect(state.status.value).toBe('success');
  });
});
