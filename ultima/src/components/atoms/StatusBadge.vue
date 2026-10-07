<script setup lang="ts">
defineProps<{ tone: 'success' | 'danger' }>();
</script>

<template>
  <span class="badge" :class="`badge--${tone}`"><slot /></span>
</template>
