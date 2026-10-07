<script setup lang="ts">
withDefaults(defineProps<{ type?: 'button' | 'submit'; variant?: 'primary' | 'secondary'; disabled?: boolean }>(), {
  type: 'button',
  variant: 'primary',
  disabled: false,
})
</script>

<template>
  <button class="btn" :class="{ 'btn--secondary': variant === 'secondary' }" :type="type" :disabled="disabled">
    <slot />
  </button>
</template>
