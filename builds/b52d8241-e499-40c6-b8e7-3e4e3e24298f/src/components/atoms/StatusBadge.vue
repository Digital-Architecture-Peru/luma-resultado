<script setup lang="ts">
defineProps<{ status: string }>()
</script>

<template>
  <span class="badge" :class="`badge--${status}`">{{ status }}</span>
</template>
