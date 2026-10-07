<script setup lang="ts">
export interface SelectOption {
  value: string;
  label: string;
}

withDefaults(
  defineProps<{
    id: string;
    options: SelectOption[];
    invalid?: boolean;
    describedby?: string;
    placeholder?: string;
  }>(),
  { invalid: false, describedby: undefined, placeholder: 'Selecciona…' }
);

const model = defineModel<string>({ required: true });
</script>

<template>
  <select
    :id="id"
    v-model="model"
    class="control"
    :aria-invalid="invalid"
    :aria-describedby="describedby"
  >
    <option value="" disabled>{{ placeholder }}</option>
    <option v-for="option in options" :key="option.value" :value="option.value">
      {{ option.label }}
    </option>
  </select>
</template>
