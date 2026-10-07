<script setup lang="ts">
defineProps<{ disabled?: boolean }>();
</script>

<template>
  <button type="button" class="btn" :disabled="disabled">
    <slot />
  </button>
</template>
