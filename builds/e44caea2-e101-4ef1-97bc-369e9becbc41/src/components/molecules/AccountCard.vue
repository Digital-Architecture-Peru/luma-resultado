<script setup lang="ts">
import { computed } from 'vue';
import type { Account } from '../../domain/account';
import { accountStatusLabels, accountStatusTone, accountTypeLabels } from '../../domain/labels';
import BaseAmount from '../atoms/BaseAmount.vue';
import BaseBadge from '../atoms/BaseBadge.vue';
import MaskedNumber from '../atoms/MaskedNumber.vue';

const props = withDefaults(defineProps<{ account: Account; selected?: boolean }>(), {
  selected: false,
});
const emit = defineEmits<{ (e: 'select', id: string): void }>();

const typeLabel = computed(() => accountTypeLabels[props.account.type]);
const statusLabel = computed(() => accountStatusLabels[props.account.status]);
const statusTone = computed(() => accountStatusTone[props.account.status]);
</script>

<template>
  <article class="card" :class="{ 'card--selected': selected }" data-testid="account-card">
    <button
      type="button"
      class="card__button"
      :aria-pressed="String(selected)"
      @click="emit('select', account.id)"
    >
      <span class="card__head">
        <span class="card__alias">{{ account.alias }}</span>
        <BaseBadge :label="statusLabel" :tone="statusTone" />
      </span>
      <span class="card__meta">{{ typeLabel }} · <MaskedNumber :number="account.number" /></span>
      <span class="card__balance">
        <span class="card__label">Saldo contable</span>
        <BaseAmount :amount-minor="account.balanceMinor" :currency="account.currency" />
      </span>
    </button>
  </article>
</template>

<style scoped>
.card {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius);
}
.card--selected {
  border-color: var(--color-primary);
  box-shadow: 0 0 0 2px var(--color-primary);
}
.card__button {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
  width: 100%;
  padding: var(--space-4);
  background: transparent;
  border: 0;
  border-radius: var(--radius);
  font: inherit;
  color: inherit;
  text-align: left;
  cursor: pointer;
}
.card__head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-3);
}
.card__alias {
  font-weight: 700;
}
.card__meta,
.card__label {
  color: var(--color-muted);
  font-size: 0.875rem;
}
.card__balance {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: var(--space-3);
}
</style>
