<script setup lang="ts">
import { computed, reactive, ref } from 'vue';
import type { Card, FieldErrors, TransactionRequest } from '../../domain/types';
import { MAX_DESCRIPTION_LENGTH, MAX_MERCHANT_LENGTH, validateDraft } from '../../domain/validation';
import BaseButton from '../atoms/BaseButton.vue';
import CardSelector from '../molecules/CardSelector.vue';
import FormField from '../molecules/FormField.vue';

const props = defineProps<{ cards: Card[]; submitting: boolean }>();
const emit = defineEmits<{ (e: 'submit', request: TransactionRequest): void }>();

const draft = reactive({ cardId: '', amount: '', merchant: '', description: '' });
const errors = ref<FieldErrors>({});

const selectedCard = computed(() => props.cards.find((c) => c.id === draft.cardId));

function onSubmit(): void {
  const result = validateDraft(draft, selectedCard.value);
  errors.value = result.errors;
  if (result.request) emit('submit', result.request);
}

function reset(): void {
  draft.amount = '';
  draft.merchant = '';
  draft.description = '';
  errors.value = {};
}

defineExpose({ reset });
</script>

<template>
  <form class="card" novalidate aria-labelledby="form-title" @submit.prevent="onSubmit">
    <h2 id="form-title">Nueva transacción</h2>
    <CardSelector v-model="draft.cardId" :cards="cards" :error="errors.cardId" />
    <FormField
      id="amount"
      v-model="draft.amount"
      label="Monto"
      inputmode="decimal"
      :error="errors.amount"
    />
    <FormField
      id="merchant"
      v-model="draft.merchant"
      label="Comercio o beneficiario"
      :maxlength="MAX_MERCHANT_LENGTH"
      :error="errors.merchant"
    />
    <FormField
      id="description"
      v-model="draft.description"
      label="Descripción (opcional)"
      :maxlength="MAX_DESCRIPTION_LENGTH"
      :error="errors.description"
    />
    <BaseButton type="submit" :disabled="submitting">
      {{ submitting ? 'Procesando…' : 'Realizar transacción' }}
    </BaseButton>
  </form>
</template>
