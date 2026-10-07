<script setup lang="ts">
import MoneyAmount from '../atoms/MoneyAmount.vue'

defineProps<{ label: string; amount: number }>()
</script>

<template>
  <div class="balance-row">
    <dt>{{ label }}</dt>
    <dd><MoneyAmount :amount="amount" /></dd>
  </div>
</template>

<style scoped>
.balance-row { display: flex; justify-content: space-between; padding: 0.4rem 0; border-bottom: 1px solid #e5e7eb; }
dt { color: #374151; }
dd { margin: 0; }
</style>
