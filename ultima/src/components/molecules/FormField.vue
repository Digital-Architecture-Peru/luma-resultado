<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps<{
  id: string;
  label: string;
  error?: string;
}>();

const errorId = computed(() => `${props.id}-error`);
const describedby = computed(() => (props.error ? errorId.value : undefined));
const invalid = computed(() => Boolean(props.error));
</script>

<template>
  <div class="field">
    <label :for="id" class="field__label">{{ label }}</label>
    <slot :id="id" :describedby="describedby" :invalid="invalid" />
    <p v-if="error" :id="errorId" class="field__error">{{ error }}</p>
  </div>
</template>
