<script setup lang="ts">
withDefaults(
  defineProps<{ type?: 'button' | 'submit'; disabled?: boolean }>(),
  { type: 'button', disabled: false },
);
</script>

<template>
  <button class="btn" :type="type" :disabled="disabled">
    <slot />
  </button>
</template>
