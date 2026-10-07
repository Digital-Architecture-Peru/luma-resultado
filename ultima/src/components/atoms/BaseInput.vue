<script setup lang="ts">
withDefaults(
  defineProps<{
    id: string;
    label: string;
    modelValue: string;
    error?: string;
    inputmode?: 'text' | 'decimal';
  }>(),
  { error: '', inputmode: 'text' },
);

const emit = defineEmits<{ (e: 'update:modelValue', value: string): void }>();

function onInput(event: Event): void {
  emit('update:modelValue', (event.target as HTMLInputElement).value);
}
</script>

<template>
  <div class="field">
    <label :for="id">{{ label }}</label>
    <input
      :id="id"
      :value="modelValue"
      :inputmode="inputmode"
      :aria-invalid="error ? 'true' : 'false'"
      :aria-describedby="error ? `${id}-error` : undefined"
      autocomplete="off"
      @input="onInput"
    />
    <p v-if="error" :id="`${id}-error`" class="field-error">{{ error }}</p>
  </div>
</template>
