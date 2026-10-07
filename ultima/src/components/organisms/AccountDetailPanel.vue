<script setup lang="ts">
import { computed } from 'vue';
import { appLocale } from '../../config';
import type { Account } from '../../domain/account';
import { formatDate } from '../../domain/format';
import { accountStatusLabels, accountStatusTone, accountTypeLabels } from '../../domain/labels';
import BaseAmount from '../atoms/BaseAmount.vue';
import BaseBadge from '../atoms/BaseBadge.vue';
import BaseSpinner from '../atoms/BaseSpinner.vue';
import MaskedNumber from '../atoms/MaskedNumber.vue';

const props = withDefaults(
  defineProps<{ account: Account | null; loading?: boolean; error?: string | null }>(),
  { loading: false, error: null },
);
const emit = defineEmits<{ (e: 'close'): void }>();

const openedAt = computed(() => {
  if (!props.account) return '';
  try {
    return formatDate(props.account.openedAt, appLocale);
  } catch {
    return '—';
  }
});
</script>

<template>
  <section class="panel" aria-labelledby="detail-title" data-testid="detail-panel">
    <header class="panel__header">
      <h2 id="detail-title" class="panel__title">Detalle de la cuenta</h2>
      <button
        v-if="account || error"
        type="button"
        class="panel__close"
        @click="emit('close')"
      >
        Cerrar detalle
      </button>
    </header>

    <div v-if="loading" class="panel__state" role="status" aria-live="polite">
      <BaseSpinner />
      <span>Cargando detalle…</span>
    </div>
    <p v-else-if="error" class="panel__error" role="alert">{{ error }}</p>
    <dl v-else-if="account" class="panel__list">
      <div class="panel__row">
        <dt>Alias</dt>
        <dd>{{ account.alias }}</dd>
      </div>
      <div class="panel__row">
        <dt>Tipo</dt>
        <dd>{{ accountTypeLabels[account.type] }}</dd>
      </div>
      <div class="panel__row">
        <dt>Número</dt>
        <dd><MaskedNumber :number="account.number" /></dd>
      </div>
      <div class="panel__row">
        <dt>Titular</dt>
        <dd>{{ account.holderName }}</dd>
      </div>
      <div class="panel__row">
        <dt>Moneda</dt>
        <dd>{{ account.currency }}</dd>
      </div>
      <div class="panel__row">
        <dt>Saldo contable</dt>
        <dd><BaseAmount :amount-minor="account.balanceMinor" :currency="account.currency" /></dd>
      </div>
      <div class="panel__row">
        <dt>Saldo disponible</dt>
        <dd><BaseAmount :amount-minor="account.availableMinor" :currency="account.currency" /></dd>
      </div>
      <div class="panel__row">
        <dt>Estado</dt>
        <dd>
          <BaseBadge
            :label="accountStatusLabels[account.status]"
            :tone="accountStatusTone[account.status]"
          />
        </dd>
      </div>
      <div class="panel__row">
        <dt>Fecha de apertura</dt>
        <dd>{{ openedAt }}</dd>
      </div>
    </dl>
    <p v-else class="panel__hint">Seleccione una cuenta para ver su detalle.</p>
  </section>
</template>

<style scoped>
.panel {
  padding: var(--space-4);
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius);
}
.panel__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-3);
  margin-bottom: var(--space-3);
}
.panel__title {
  margin: 0;
  font-size: 1.125rem;
}
.panel__close {
  padding: var(--space-1) var(--space-3);
  font: inherit;
  color: var(--color-primary);
  background: transparent;
  border: 1px solid var(--color-primary);
  border-radius: var(--radius);
  cursor: pointer;
}
.panel__state {
  display: flex;
  align-items: center;
  gap: var(--space-3);
}
.panel__error {
  margin: 0;
  color: var(--color-danger-text);
}
.panel__hint {
  margin: 0;
  color: var(--color-muted);
}
.panel__list {
  display: grid;
  gap: var(--space-2);
  margin: 0;
}
.panel__row {
  display: flex;
  justify-content: space-between;
  gap: var(--space-3);
  padding-bottom: var(--space-2);
  border-bottom: 1px solid var(--color-neutral-bg);
}
.panel__row dt {
  color: var(--color-muted);
}
.panel__row dd {
  margin: 0;
  text-align: right;
}
</style>
