<script setup lang="ts">
import { computed } from 'vue';
import BaseInput from '../atoms/BaseInput.vue';

const props = defineProps<{
  id: string;
  label: string;
  modelValue: string;
  error?: string;
  inputmode?: 'text' | 'decimal';
  maxlength?: number;
}>();

const emit = defineEmits<{ (e: 'update:modelValue', value: string): void }>();

const errorId = computed(() => `${props.id}-error`);
</script>

<template>
  <div class="field">
    <label :for="id">{{ label }}</label>
    <BaseInput
      :id="id"
      :model-value="modelValue"
      :invalid="Boolean(error)"
      :described-by="error ? errorId : undefined"
      :inputmode="inputmode"
      :maxlength="maxlength"
      @update:model-value="emit('update:modelValue', $event)"
    />
    <p v-if="error" :id="errorId" class="field__error">{{ error }}</p>
  </div>
</template>
