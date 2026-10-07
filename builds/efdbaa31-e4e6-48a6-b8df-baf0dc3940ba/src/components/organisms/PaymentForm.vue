<script setup lang="ts">
import { computed, reactive } from 'vue';
import BaseButton from '../atoms/BaseButton.vue';
import BaseInput from '../atoms/BaseInput.vue';
import BaseSelect from '../atoms/BaseSelect.vue';
import FormField from '../molecules/FormField.vue';
import {
  MAX_CONCEPT_LENGTH,
  formatMoney,
  type Account,
  type Beneficiary,
  type PaymentErrors,
  type PaymentFormValues
} from '../../domain/payment';

const props = defineProps<{
  accounts: Account[];
  beneficiaries: Beneficiary[];
  errors: PaymentErrors;
  busy: boolean;
}>();

const emit = defineEmits<{ submit: [values: PaymentFormValues] }>();

const values = reactive<PaymentFormValues>({
  sourceAccountId: '',
  beneficiaryId: '',
  amount: '',
  concept: ''
});

const accountOptions = computed(() =>
  props.accounts.map((a) => ({
    value: a.id,
    label: `${a.alias} ${a.maskedNumber} · ${formatMoney(a.balance)}`
  }))
);
const beneficiaryOptions = computed(() =>
  props.beneficiaries.map((b) => ({ value: b.id, label: `${b.name} ${b.maskedNumber}` }))
);

function onSubmit(): void {
  emit('submit', { ...values });
}
</script>

<template>
  <form class="card form" novalidate aria-label="Formulario de pago" @submit.prevent="onSubmit">
    <FormField id="source" label="Cuenta de origen" :error="errors.sourceAccountId">
      <template #default="slot">
        <BaseSelect
          :id="slot.id"
          v-model="values.sourceAccountId"
          :options="accountOptions"
          :invalid="slot.invalid"
          :describedby="slot.describedby"
        />
      </template>
    </FormField>

    <FormField id="beneficiary" label="Beneficiario" :error="errors.beneficiaryId">
      <template #default="slot">
        <BaseSelect
          :id="slot.id"
          v-model="values.beneficiaryId"
          :options="beneficiaryOptions"
          :invalid="slot.invalid"
          :describedby="slot.describedby"
        />
      </template>
    </FormField>

    <FormField id="amount" label="Importe (PEN)" :error="errors.amount">
      <template #default="slot">
        <BaseInput
          :id="slot.id"
          v-model="values.amount"
          inputmode="decimal"
          placeholder="0.00"
          :invalid="slot.invalid"
          :describedby="slot.describedby"
        />
      </template>
    </FormField>

    <FormField id="concept" label="Concepto" :error="errors.concept">
      <template #default="slot">
        <BaseInput
          :id="slot.id"
          v-model="values.concept"
          :maxlength="MAX_CONCEPT_LENGTH"
          :invalid="slot.invalid"
          :describedby="slot.describedby"
        />
      </template>
    </FormField>

    <BaseButton type="submit" :disabled="busy">{{ busy ? 'Procesando…' : 'Pagar' }}</BaseButton>
  </form>
</template>
