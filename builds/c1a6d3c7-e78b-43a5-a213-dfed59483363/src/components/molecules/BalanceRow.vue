<script setup lang="ts">
import MoneyAmount from '../atoms/MoneyAmount.vue'

defineProps<{ label: string; amount?: number; currency?: string; text?: string }>()
</script>

<template>
  <div class="row">
    <dt>{{ label }}</dt>
    <dd>
      <MoneyAmount v-if="amount !== undefined" :amount="amount" :currency="currency" />
      <span v-else>{{ text ?? '—' }}</span>
    </dd>
  </div>
</template>

<style scoped>
.row { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #e3e6ea; }
dt { color: var(--color-muted, #444b55); }
dd { margin: 0; }
</style>
