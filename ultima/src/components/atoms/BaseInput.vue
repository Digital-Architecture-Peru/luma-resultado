<script setup lang="ts">
defineProps<{
  id: string;
  modelValue: string;
  invalid?: boolean;
  describedBy?: string;
  inputmode?: 'text' | 'decimal';
  maxlength?: number;
}>();

const emit = defineEmits<{ (e: 'update:modelValue', value: string): void }>();

function onInput(event: Event): void {
  emit('update:modelValue', (event.target as HTMLInputElement).value);
}
</script>

<template>
  <input
    :id="id"
    class="input"
    type="text"
    :value="modelValue"
    :inputmode="inputmode"
    :maxlength="maxlength"
    :aria-invalid="invalid ? 'true' : 'false'"
    :aria-describedby="describedBy"
    @input="onInput"
  />
</template>
