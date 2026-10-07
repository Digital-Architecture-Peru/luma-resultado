<script setup lang="ts">
import { reactive, ref } from 'vue';
import type { Card, TransactionDraft, TransactionInput, ValidationErrors } from '../../domain/types';
import { parseAmount, validateDraft } from '../../domain/validation';
import BaseButton from '../atoms/BaseButton.vue';
import BaseInput from '../atoms/BaseInput.vue';
import CardSelect from '../molecules/CardSelect.vue';

const props = defineProps<{ cards: Card[]; submitting?: boolean }>();
const emit = defineEmits<{ (e: 'submit', input: TransactionInput): void }>();

const draft = reactive<TransactionDraft>({ cardId: '', amountText: '', merchant: '' });
const errors = ref<ValidationErrors>({});

function onSubmit(): void {
  errors.value = validateDraft(draft, props.cards);
  if (Object.keys(errors.value).length > 0) return;
  emit('submit', {
    cardId: draft.cardId,
    amount: parseAmount(draft.amountText) as number,
    merchant: draft.merchant.trim(),
  });
}
</script>

<template>
  <form class="card-panel" novalidate @submit.prevent="onSubmit">
    <h2>Nueva transacción</h2>
    <CardSelect v-model="draft.cardId" :cards="cards" :error="errors.cardId" />
    <BaseInput id="amount" v-model="draft.amountText" label="Monto" inputmode="decimal" :error="errors.amountText" />
    <BaseInput id="merchant" v-model="draft.merchant" label="Comercio" :error="errors.merchant" />
    <BaseButton type="submit" :disabled="submitting">
      {{ submitting ? 'Enviando…' : 'Pagar' }}
    </BaseButton>
  </form>
</template>
