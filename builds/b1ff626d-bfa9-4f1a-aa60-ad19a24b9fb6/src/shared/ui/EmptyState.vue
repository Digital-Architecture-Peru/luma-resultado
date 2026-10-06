<script setup>
defineProps({
  message: { type: String, default: 'No hay elementos.' },
});
</script>

<template>
  <p class="empty-state">{{ message }}</p>
</template>

<style scoped>
.empty-state {
  margin: 1rem 0;
  color: #4b5563;
  font-style: italic;
}
</style>
